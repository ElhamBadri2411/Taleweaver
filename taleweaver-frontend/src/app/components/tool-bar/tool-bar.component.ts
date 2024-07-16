import { Component, EventEmitter, Output } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { bootstrapVolumeUpFill } from '@ng-icons/bootstrap-icons';
import { bootstrapPencilSquare } from '@ng-icons/bootstrap-icons';
import { bootstrapX } from '@ng-icons/bootstrap-icons';
import { bootstrapTrash } from '@ng-icons/bootstrap-icons';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '../../services/data.service';
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
  viewProviders: [provideIcons({ bootstrapVolumeUpFill, bootstrapPencilSquare, bootstrapX, bootstrapTrash})]
})
export class ToolBarComponent {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dataService: DataService,
    private ttsService: TtsService,
    private storyService: StoryService
  ) { }

  text: string = '';
  @Output() stateChange = new EventEmitter<string>();
  audioVisible = false;
  isModalOpen = false;
  baseUrl = environment.apiUrl
  bookId = this.route.snapshot.params['id'];
  audioUrl = `${this.baseUrl}generated-audio/${this.bookId}-output.mp3`;

  edit() {
    const currentPath = this.route.snapshot.url.map(segment => segment.path).join('/');
    const newPath = currentPath + '/edit';
    this.router.navigate([newPath]);
  }

  tts() {
    this.ttsService.checkAudio(this.bookId).subscribe((res) => {
      if (res.exists) {
        this.audioVisible = true;
      }
      else {
        this.stateChange.emit('loading');
        this.ttsService.generateAudio(this.text, this.bookId).subscribe(() => {
          this.stateChange.emit('done');
          this.audioVisible = true;
        });
      }
    });
  }

  ngOnInit() {
    this.dataService.bookContent$.subscribe(content => {
      this.text = content;
    });
  }

  closeAudio(){
    this.stateChange.emit('loading');
    this.ttsService.deleteAudio(this.bookId).subscribe(() => {
      this.audioVisible = false;
      this.stateChange.emit('done');
    });
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  confirmDelete() {
    // Call your delete logic here
    this.delete();
    this.closeModal(); // Close the modal after confirming
  }

  delete() {
    this.storyService.deleteStory(this.bookId).subscribe(() => {
      this.router.navigate(['/dashboard']);
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
