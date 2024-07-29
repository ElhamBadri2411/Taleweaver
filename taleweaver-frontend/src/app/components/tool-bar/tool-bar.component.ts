import { Component, EventEmitter, Output } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { bootstrapVolumeUpFill } from '@ng-icons/bootstrap-icons';
import { bootstrapPencilSquare } from '@ng-icons/bootstrap-icons';
import { bootstrapX } from '@ng-icons/bootstrap-icons';
import { bootstrapTrash } from '@ng-icons/bootstrap-icons';
import { bootstrapSendArrowUp } from '@ng-icons/bootstrap-icons';
import { bootstrapSendArrowDown } from '@ng-icons/bootstrap-icons';
import { bootstrapPersonAdd } from '@ng-icons/bootstrap-icons';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '../../services/data.service';
import { AccessService } from '../../services/access.service';
import { UserService } from '../../services/user.service';
import { TtsService } from '../../services/tts.service';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';
import { StoryService } from '../../services/story.service';

@Component({
  selector: 'app-tool-bar',
  standalone: true,
  imports: [NgIconComponent, CommonModule],
  templateUrl: './tool-bar.component.html',
  styleUrl: './tool-bar.component.css',
  viewProviders: [
    provideIcons({
      bootstrapVolumeUpFill,
      bootstrapPencilSquare,
      bootstrapX,
      bootstrapTrash,
      bootstrapSendArrowUp,
      bootstrapSendArrowDown,
      bootstrapPersonAdd,
    }),
  ],
})
export class ToolBarComponent {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dataService: DataService,
    private ttsService: TtsService,
    private storyService: StoryService,
    private userService: UserService,
    private accessService: AccessService,
  ) { }

  text: string = '';
  access = '';
  isPublic = false;
  users: any[] = [];
  accessList: string[] = [];
  @Output() stateChange = new EventEmitter<string>();
  audioVisible = false;
  deleteModal = false;
  addCollaboratorModal = false;
  baseUrl = environment.apiUrl;
  bookId = this.route.snapshot.params['id'];
  audioUrl = `${this.baseUrl}generated-audio/${this.bookId}-output.mp3`;

  edit() {
    const currentPath = this.route.snapshot.url
      .map((segment) => segment.path)
      .join('/');
    const newPath = currentPath + '/edit';
    this.router.navigate([newPath]);
  }

  tts() {
    this.ttsService.checkAudio(this.bookId).subscribe((res) => {
      if (res.exists) {
        this.audioVisible = true;
      } else {
        this.stateChange.emit('loading');
        this.ttsService.generateAudio(this.text, this.bookId).subscribe(() => {
          this.stateChange.emit('done');
          this.audioVisible = true;
        });
      }
    });
  }

  closeAudio() {
    this.stateChange.emit('loading');
    this.ttsService.deleteAudio(this.bookId).subscribe(() => {
      this.audioVisible = false;
      this.stateChange.emit('done');
    });
  }

  openDeleteModal() {
    this.deleteModal = true;
  }

  closeDeleteModal() {
    this.deleteModal = false;
  }

  confirmDelete() {
    this.delete();
    this.closeDeleteModal();
  }

  delete() {
    this.storyService.deleteStory(this.bookId).subscribe(() => {
      this.router.navigate(['/dashboard']);
    });
  }

  public() {
    this.isPublic = !this.isPublic;
    this.storyService
      .updatePublicStatus(this.bookId, this.isPublic)
      .subscribe(() => { });
  }

  getCollaborators() {
    this.accessService
      .getAccessByStoryBookId(this.bookId)
      .subscribe((accesses) => {
        this.accessList = [];
        accesses.forEach((access) => {
          this.accessList.push(access.email);
        });
      });
  }

  addCollaborator() {
    this.getCollaborators();
    this.userService.getAllUsers().subscribe((users) => {
      this.users = users;
      this.addCollaboratorModal = true;
    });
  }

  updateAccess(googleId: string, checked: Event) {
    const isChecked = (checked.target as HTMLInputElement).checked;
    if (isChecked) {
      this.accessService
        .createAccess(googleId, this.bookId, 'write')
        .subscribe(() => { });
    } else {
      this.accessService
        .deleteAccess(googleId, this.bookId)
        .subscribe(() => { });
    }
  }

  closeCollaboratorModal() {
    this.addCollaboratorModal = false;
  }

  confirmCollaborator() {
    console.log('collaborator added');
  }

  ngOnInit() {
    this.storyService.getStoryById(this.bookId).subscribe((story) => {
      this.isPublic = story.public;
    });
    this.dataService.bookContent$.subscribe((content) => {
      this.text = content;
    });

    this.dataService.access$.subscribe((access) => {
      this.access = access;
    });
  }

  ngOnDestroy() {
    this.ttsService.checkAudio(this.bookId).subscribe((res) => {
      if (res.exists) {
        this.ttsService.deleteAudio(this.bookId).subscribe(() => {
          this.audioVisible = false;
        });
      }
    });
  }
}
