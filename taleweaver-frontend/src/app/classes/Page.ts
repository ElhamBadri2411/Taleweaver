export interface Page {
  id: number;
  paragraph: string;
  image: ImageData;
  order: number;
}

export interface ImageData {
  prompt: string,
  path: string
}
