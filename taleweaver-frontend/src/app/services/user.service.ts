import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../classes/User';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private endpoint = environment.apiUrl + 'users';

  constructor(private http: HttpClient) {}

  getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  /**
   * Fetches a user by id
   * @param id The id of the user to be fetched
   * @returns Observable<User>
   */
  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.endpoint}/${id}`, {
      headers: this.getHeaders(),
    });
  }

  /**
   * Creates a new user.
   * @param id_token - The ID token of the user.
   * @returns An Observable that emits a string indicating the result of the operation.
   */
  createUser(id_token: string): Observable<string> {
    return this.http.post<string>(`${this.endpoint}`, { id_token });
  }

  /**
   * Fetches all users.
   * @param id The id of the story book.
   * @returns An Observable that emits an array of User objects.
   */
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.endpoint}`, {
      headers: this.getHeaders(),
    });
  }
}
