import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StoryBook } from '../classes/StoryBook';

@Injectable({
  providedIn: 'root',
})
export class StoryService {
  private endpoint = environment.apiUrl + 'storybooks';

  constructor(private http: HttpClient) { }

  /**
   * Creates a storybook
   * @param title Title of the storybook
   * @param descrption A short summary/decsription of the stroybook
   * @returns Observable<StoryBook>
   */
  createStory(title: string, description: string): Observable<StoryBook> {
    return this.http.post<StoryBook>(`${this.endpoint}`, {
      title,
      description,
    });
  }

  /**
   * Deletes a storybook
   * @param id The id of the story to be deleted
   * @returns Observable<any>
   */
  deleteStory(id: number): Observable<any> {
    return this.http.delete<any>(`${this.endpoint}/${id}`);
  }

  /**
   * Fetches a storybook by id
   * @param id The id of the story to be fetched
   * @returns Observable<StoryBook>
   */
  getStoryById(id: number): Observable<StoryBook> {
    return this.http.get<StoryBook>(`${this.endpoint}/${id}`);
  }

  /**
   * Fetches all the storybooks of a user
   * @param id User id of the user we want to fetch the books for
   * @returns Observable<StoryBook>
   */
  getBooksByUser(id: number): Observable<StoryBook[]> {
    return this.http.get<StoryBook[]>(`${this.endpoint}/user/${id}`);
  }

  /**
   * Rename a storybook
   * @param id The id of the story to be fetched
   * @returns Observable<StoryBook>
   */
  renameStory(id: number, newTitle: string): Observable<StoryBook> {
    return this.http.patch<StoryBook>(`${this.endpoint}/${id}`, {
      title: newTitle,
    });
  }
}
