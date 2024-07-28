import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StoryBook } from '../classes/StoryBook';

@Injectable({
  providedIn: 'root',
})
export class StoryService {
  private endpoint = environment.apiUrl + 'storybooks';
  private headers = new HttpHeaders({
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  });

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
    }, { headers: this.headers });
  }

  /**
   * Deletes a storybook
   * @param id The id of the story to be deleted
   * @returns Observable<any>
   */
  deleteStory(id: number): Observable<any> {
    return this.http.delete<any>(`${this.endpoint}/${id}`, { headers: this.headers });
  }

  /**
   * Fetches a storybook by id
   * @param id The id of the story to be fetched
   * @returns Observable<StoryBook>
   */
  getStoryById(id: number): Observable<{ storyBook: StoryBook, access: string, public: boolean }> {
    return this.http.get<{ storyBook: StoryBook, access: string, public: boolean }>(`${this.endpoint}/${id}`, { headers: this.headers });
  }

  /**
   * Fetches all the storybooks of a user
   * @param id User id of the user we want to fetch the books for
   * @param filter Filter to be applied to the books
   * @param limit Limit the number of books to be fetched
   * @param page The page number to be fetched
   * @returns Observable<StoryBook>
   */
  getStoryBooks(id: string, page: number, filter?: string, limit?: number): Observable<{ pageOfBook: number, books: StoryBook[] }> {
    const url = filter 
        ? (limit 
          ? `${this.endpoint}/users/${id}?page=${page}&filter=${filter}&limit=${limit}`
          :`${this.endpoint}/users/${id}?page=${page}&filter=${filter}`) 
        : `${this.endpoint}/users/${id}?page=${page}`;
    return this.http.get<{ pageOfBook: number, books: StoryBook[] }>(url, { headers: this.headers });
  }

  /**
   * Fetches all the public storybooks
   * @param filter Filter to be applied to the books
   * @param limit Limit the number of books to be fetched
   * @param page The page number to be fetched
   * @returns Observable<StoryBook>
   */
  getPublicStoryBooks(page: number, filter?: string, limit?: number): Observable<{ pageOfBook: number, books: StoryBook[] }> {
    const url = filter 
        ? (limit 
          ? `${this.endpoint}/public?page=${page}&filter=${filter}&limit=${limit}`
          :`${this.endpoint}/public?page=${page}&filter=${filter}`) 
        : `${this.endpoint}/public?page=${page}`;
    return this.http.get<{ pageOfBook: number, books: StoryBook[] }>(url, { headers: this.headers });
  }

  /**
   * Update the public status of a storybook
   * @param id The id of the story to be fetched
   * @returns Observable<StoryBook>
   */
  updatePublicStatus(id: number, isPublic: boolean): Observable<StoryBook> {
    return this.http.patch<StoryBook>(`${this.endpoint}/public/${id}`, {
      isPublic,
    }, { headers: this.headers });
  }

  /**
   * Rename a storybook
   * @param id The id of the story to be fetched
   * @returns Observable<StoryBook>
   */
  renameStory(id: number, newTitle: string): Observable<StoryBook> {
    return this.http.patch<StoryBook>(`${this.endpoint}/${id}`, {
      title: newTitle,
    }, { headers: this.headers });
  }

  /**
   * Creates a storybook and starts the generation process
   * @param title Title of the storybook
   * @param description A short summary/description of the storybook
   * @returns Observable<{ message: string, storyId: string }>
   */
  generateStory(title: string, description: string): Observable<{ message: string, storyId: string }> {
    return this.http.post<{ message: string, storyId: string }>(`${this.endpoint}/generate`, {
      title,
      description,
    }, { headers: this.headers });
  }

  /**
   * Gets the status of a generation
   * @param id the id of the story
   * @returns Observable<{ status: string, progres: number}>
   */
  getGenerationStatus(id: string): Observable<{ status: string, progress: number }> {
    return this.http.get<{ status: string, progress: number }>(`${this.endpoint}/status/${id}`, { headers: this.headers });
  }

}
