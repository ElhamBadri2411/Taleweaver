export interface Page {
  id: number;
  paragraph: string;
  image: ImageData;
  position: number;
}

export interface ImageData {
  prompt: string;
  path: string;
}
