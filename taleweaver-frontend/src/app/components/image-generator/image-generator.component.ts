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

  private destroy = new Subject<void>();
  private autoSave = new Subject<string>();

  title: string = 'Test title';
  form: FormGroup;
  imageUrl: string = '';
  testImageUrl: string =
    environment.apiUrl + 'generated-images/20cbbc5619f1c04a5b32f0025461acf8.png';
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
    private pagesService: PageService
  ) {
    this.form = this.fb.group({
      text: [''],
    });
  }

  ngOnInit(): void {
    this.initializeYjs();
    this.autoSaveSetup();


    this.provider.awareness.on('change', this.handleAwarenessChange.bind(this));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pageId'] && !changes['pageId'].isFirstChange()) {
      this.loadPageData();
    }
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
    this.cleanupYjs();
    this.provider.awareness.off('change', this.handleAwarenessChange);
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

    // Initialize Yjs
    this.ydoc = new Y.Doc();
    this.provider = new WebsocketProvider(
      'ws://localhost:3000',
      this.bookId,
      this.ydoc
    );

    // Assign a random color from the colors array
    const randomColor = this.colors[Math.floor(Math.random() * this.colors.length)];
    this.provider.awareness.setLocalStateField('user', {
      name: 'Elham',
      color: randomColor
    });

    // Create or get the Y.Text type for the page content
    if (this.pageId !== null) {
      this.type = this.ydoc.getText(`page-${this.pageId}`);
      if (this.quillEditor) {
        this.binding = new QuillBinding(this.type, this.quillEditor, this.provider.awareness);

        // Set Quill editor content from Yjs type initially
        const delta = this.type.toDelta();
        this.quillEditor.setContents(delta);
      }
    }

    // Create or get the Y.Map for the image URL
    this.imageMap = this.ydoc.getMap('images');
    this.imageMap.observe(event => {
      if (event.keysChanged.has(`page-${this.pageId}`)) {
        this.imageUrl = this.imageMap.get(`page-${this.pageId}`) || '';
      }
      this.imageGenerated.emit();
    });
  }

  cleanupYjs(): void {
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

          if (res.paragraph) {
            this.type.delete(0, this.type.length);
            this.type.insert(0, res.paragraph);
          }

          // Set Quill editor content from Yjs type
          const delta = this.type.toDelta();
          this.quillEditor.setContents(delta);

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
