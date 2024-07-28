import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Access } from '../classes/Access';

@Injectable({
  providedIn: 'root'
})
export class AccessService {
  private endpoint = environment.apiUrl + 'accesses';
  private headers = new HttpHeaders({
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  });

  constructor(private http: HttpClient) { }

  /**
   * Creates a new access.
   * @param googleId The Google ID of the user.
   * @param storyBookId The ID of the story book.
   * @param role The role of the user.
   * @returns An Observable that emits an Access object.
  */
  createAccess(googleId: string, storyBookId: string, role: string): Observable<Access> {
    return this.http.post<Access>(this.endpoint, 
      { googleId, storyBookId, role }, 
      { headers: this.headers });
  }

  /**
   * Deletes an access.
   * @param googleId The Google ID of the user.
   * @param storyBookId The ID of the story book.
   * @returns An Observable that emits an Object.
  */
  deleteAccess(googleId: string, storyBookId: string): Observable<Object> {
    return this.http.delete(`${this.endpoint}?googleId=${googleId}&storyBookId=${storyBookId}`, 
      { headers: this.headers }); 
  }

  /**
   * Gets an access.
   * @param storyBookId The ID of the story book.
   * @returns An Observable that emits an Access object.
  */
  getAccessByStoryBookId(storyBookId: string): Observable<[{email: string}]> {
    return this.http.get<[{email: string}]>(`${this.endpoint}/${storyBookId}`, 
      { headers: this.headers });
  }
}
