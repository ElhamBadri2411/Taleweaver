import { Injectable } from '@angular/core';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class YjsService {
  public ydoc: Y.Doc;
  public provider: WebsocketProvider;

  constructor() {
    this.ydoc = new Y.Doc();
  }

  init(bookId: string): void {
    this.provider = new WebsocketProvider(environment.wsUrl, bookId, this.ydoc);
  }

  clean(): void {
    if (this.provider) {
      this.provider.destroy();
    }
    if (this.ydoc) {
      this.ydoc.destroy();
    }
  }
}
