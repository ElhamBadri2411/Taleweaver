import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Image } from '../classes/Image';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {
  private endpoint = environment.apiUrl + 'images'


  constructor(private http: HttpClient) { }

  /**
     * Generates an image based on the provided text prompt.
     * @param text The text prompt for image generation
     * @returns Observable<ImageResponse>
     */
  generateImage(text: string): Observable<Image> {
    return this.http.post<Image>(`${this.endpoint}`, { text });
  }
}
