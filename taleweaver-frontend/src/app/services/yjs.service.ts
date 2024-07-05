import { Injectable } from '@angular/core';
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class YjsService {
  private doc: Y.Doc;
  private wsProvider: WebsocketProvider;

  constructor() { }

  init(pageId: string): void {
    this.doc = new Y.Doc()
    this.wsProvider = new WebsocketProvider(environment.wsUrl, `page-${pageId}`, this.doc)
  }
}
