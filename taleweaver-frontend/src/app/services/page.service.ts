import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Page } from '../classes/Page';

@Injectable({
  providedIn: 'root',
})
export class PageService {
  private endpoint = environment.apiUrl + 'pages';

  constructor(private http: HttpClient) { }

  /**
   * Adds a page to a storybook
   * @param id The id of the storybook
   * @returns Observable<Page>
   */
  addPage(id: number): Observable<Page> {
    return this.http.post<Page>(`${this.endpoint}/new`, {
      storyBookId: id,
    });
  }

  /**
   * Get the page of a storybook by id
   * @param id The id of the Page
   * @returns Observable<Page>
   */
  getPageById(id: number): Observable<Page> {
    return this.http.get<Page>(`${this.endpoint}/${id}`);
  }

  /**
   * Get the page of a storybook by id
   * @param id The id of the Page
   * @returns Observable<Page>
   */
  getPagesByStoryBookId(id: number): Observable<Page[]> {
    return this.http.get<Page[]>(`${this.endpoint}/storybooks/${id}`);
  }

  /**
   * Get all the pages of a storybook by id
   * @param id The id of the storybook
   * @returns Observable<Page>
   */
  updatePage(id: number, paragraph: string): Observable<Page> {
    return this.http.patch<Page>(`${this.endpoint}/${id}`, {
      paragraph,
    });
  }
}
