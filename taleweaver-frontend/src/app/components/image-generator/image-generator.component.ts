import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { ImagesService } from '../../services/images.service';
import { environment } from '../../../environments/environment';
import { heroSparklesSolid, heroXCircleSolid } from '@ng-icons/heroicons/solid';
import { PageService } from '../../services/page.service';
import { debounceTime, takeUntil, Subject } from 'rxjs';
import Quill from 'quill';
import QuillCursors from 'quill-cursors';
import * as Y from 'yjs';
import { QuillBinding } from 'y-quill';
import { WebsocketProvider } from 'y-websocket';
import { Awareness } from 'y-protocols/awareness';
import { GoogleApiService } from '../../services/google/google-api.service';

// Register the QuillCursors module
Quill.register('modules/cursors', QuillCursors);

@Component({
  selector: 'app-image-generator',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgIconComponent,
  ],
  templateUrl: './image-generator.component.html',
  styleUrls: ['./image-generator.component.css'],
  viewProviders: [provideIcons({ heroSparklesSolid, heroXCircleSolid })],
})
export class ImageGeneratorComponent
  implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  @Input() bookId!: string;
  @Input() pageId: number | null = null;
  @Output() imageGenerated = new EventEmitter<void>();
  @ViewChild('editorContainer', { static: false }) editorContainer!: ElementRef;

  @Input() bookTitle: string
  @Input() bookDesc: string

  private destroy = new Subject<void>();
  private autoSave = new Subject<string>();

  form: FormGroup;
  imageUrl: string = '';
  isGeneratingImage: boolean = false;
  isSaving: boolean = false;
  isEditing: boolean = false;

  quillEditor!: Quill;
  ydoc!: Y.Doc;
  provider!: WebsocketProvider;
  type!: Y.Text;
  binding!: QuillBinding;
  imageMap!: Y.Map<any>;
  awareness!: Awareness;

  activeUsers: { name: string; color: string }[] = [];

  private colors: string[] = [
    '#1be7ff', '#6eeb83', '#e4ff1a', '#ff9a1f', '#ff5714',
    '#ff3c6f', '#cb6ce6', '#6c95e6', '#6ce6d6', '#e66c6c'
  ];

  constructor(
    private fb: FormBuilder,
    private imagesService: ImagesService,
    private pagesService: PageService,
  ) {
    this.form = this.fb.group({
      text: [''],
    });
  }

  ngOnInit(): void {
    this.initializeYjs();
    this.autoSaveSetup();

    console.log("this.binding =", this.binding)

    this.provider.awareness.on('change', this.handleAwarenessChange.bind(this));
    window.addEventListener('beforeunload', this.cleanupAwarenessState.bind(this));
    window.addEventListener('beforeunload', this.cleanupYjs.bind(this));
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log("IT BE CHANGING")
    if (changes['pageId'] && !changes['pageId'].isFirstChange()) {
      this.loadPageData();
    }
  }

  ngOnDestroy(): void {
    this.cleanupYjs();
    this.cleanupAwarenessState();
    window.removeEventListener('beforeunload', this.cleanupAwarenessState.bind(this));
    window.removeEventListener('beforeunload', this.cleanupYjs.bind(this));
    this.provider.awareness.off('change', this.handleAwarenessChange);
    this.destroy.next();
    this.destroy.complete();
  }

  ngAfterViewInit(): void {
    this.initializeQuillEditor();
  }

  initializeQuillEditor(): void {
    if (this.editorContainer) {
      this.quillEditor = new Quill(this.editorContainer.nativeElement, {
        theme: 'bubble',
        modules: {
          toolbar: false, // Disable the toolbar
          cursors: true,  // Enable the cursors module
        },
        placeholder: "Write your story here ..."
      });

      // Listen to Quill editor changes and update the form control
      this.quillEditor.on('text-change', () => {
        console.log("TEX CHANGE")
        this.form.get('text')?.patchValue(this.quillEditor.getText());
      });

      // Update awareness when selection changes
      this.quillEditor.on('selection-change', (range) => {
        if (range) {
          this.provider.awareness.setLocalStateField('selection', range);
        }
      });
    }
  }

  initializeYjs(): void {
    this.cleanupYjs();

    this.ydoc = new Y.Doc();
    this.provider = new WebsocketProvider('ws://localhost:3000', this.bookId, this.ydoc);

    const randomColor = this.colors[Math.floor(Math.random() * this.colors.length)];
    this.provider.awareness.setLocalStateField('user', {
      name: 'Elham',
      color: randomColor
    });

    if (this.pageId !== null) {
      this.type = this.ydoc.getText(`page-${this.pageId}`);
      if (this.quillEditor) {

        if (!this.binding) {
          this.binding = new QuillBinding(this.type, this.quillEditor, this.provider.awareness);
        }

        if (this.quillEditor.getLength() === 0) { // Length 1 means only the default empty line
          const delta = this.type.toDelta();
          this.quillEditor.setContents(delta);
        }
      }
    }

    this.imageMap = this.ydoc.getMap('images');
    this.imageMap.observe(event => {
      if (event.keysChanged.has(`page-${this.pageId}`)) {
        this.imageUrl = this.imageMap.get(`page-${this.pageId}`) || '';
      }
      this.imageGenerated.emit();
    });
  }

  cleanupYjs(): void {
    console.log("cleaning");
    if (this.binding) {
      this.binding.destroy();
    }
    if (this.provider) {
      this.provider.destroy();
    }
    if (this.ydoc) {
      this.ydoc.destroy();
    }
  }

  autoSaveSetup(): void {
    this.form
      .get('text')
      ?.valueChanges.pipe(takeUntil(this.destroy))
      .subscribe((val) => {
        this.isEditing = true;
        this.autoSave.next(val);
      });

    this.autoSave
      .pipe(debounceTime(2000), takeUntil(this.destroy))
      .subscribe((text) => {
        this.isEditing = false;
        this.savePage(text);
      });
  }

  cleanupAwarenessState(): void {
    // cleans the states of the cursors
    this.provider.awareness.setLocalState(null);
  }

  savePage(text: string): void {
    if (this.pageId !== null) {
      this.isSaving = true;
      this.pagesService.updatePage(this.pageId!, text).subscribe({
        next: (res) => {
          this.isSaving = false;
        },
        error: (error) => {
          console.error('Save error:', error);
          this.isSaving = false;
        },
      });
    }
  }

  loadPageData(): void {
    this.imageUrl = '';
    if (this.pageId !== null) {
      this.pagesService.getPageById(this.pageId).subscribe({
        next: (res) => {
          // Switch the Yjs text type for the new page
          this.type = this.ydoc.getText(`page-${this.pageId}`);
          if (this.binding) {
            this.binding.destroy();
          }
          this.binding = new QuillBinding(this.type, this.quillEditor, this.provider.awareness);

          // Only set content from backend if Yjs type is empty
          if (this.type.length === 0 && res.paragraph) {
            this.type.delete(0, this.type.length);
            this.type.insert(0, res.paragraph);
          }

          if (res.image.path) {
            this.imageUrl = environment.apiUrl + res.image.path;
          }
        },
        error: (error) => {
          console.error('Load error:', error);
        },
      });
    }
  }

  generateImage() {
    this.isGeneratingImage = true;
    const text = this.form.get('text')?.value;
    this.imagesService.generateImage(text, this.pageId || 1).subscribe(
      (res) => {
        this.imageUrl = environment.apiUrl + res.imagePath;
        this.imageMap.set(`page-${this.pageId}`, this.imageUrl); // Update Yjs map
        this.isGeneratingImage = false;
        this.imageGenerated.emit();
      },
      (error: any) => {
        console.error('Error generating image:', error);
        this.isGeneratingImage = false;
      }
    );
  }

  handleAwarenessChange(change: any): void {
    const states = this.provider.awareness.getStates();
    const cursors: any = this.quillEditor.getModule('cursors');

    cursors.clearCursors();

    this.activeUsers = [];

    states.forEach((state: any, clientId: number) => {
      if (state.user && clientId !== this.provider.awareness.clientID) {
        cursors.createCursor(clientId, state.user.name, state.user.color);

        if (state.selection) {
          cursors.moveCursor(clientId, state.selection.index, state.selection.length);
        }

        this.activeUsers.push({
          name: state.user.name,
          color: state.user.color
        });
      }
    });
  }
}
