import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TtsService {
  private endpoint = environment.apiUrl + 'tts';
  private headers = new HttpHeaders({
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  });
  
  constructor(
    private http: HttpClient
  ) { }

  generateAudio(text: string, bookId: string): Observable<any> {
    return this.http.post<any>(`${this.endpoint}/`, {
      text,
      bookId
    }, { headers: this.headers });
  }

  checkAudio(bookId: string): Observable<any> {
    return this.http.get<any>(`${this.endpoint}/${bookId}`, { headers: this.headers });
  }

  deleteAudio(bookId: string): Observable<any> {
    return this.http.delete<any>(`${this.endpoint}/${bookId}`, { headers: this.headers });
  }
}
