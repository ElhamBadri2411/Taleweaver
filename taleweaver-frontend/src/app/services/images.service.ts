import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Image } from '../classes/Image';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ImagesService {
  private endpoint = environment.apiUrl + 'images';

  constructor(private http: HttpClient) {}
  getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  /**
   * Generates an image based on the provided text prompt.
   * @param text The text prompt for image generation
   * @returns Observable<ImageResponse>
   */
  generateImage(text: string, pageId: number): Observable<Image> {
    return this.http.post<Image>(
      `${this.endpoint}`,
      { text, pageId },
      {
        headers: this.getHeaders(),
      },
    );
  }
}
