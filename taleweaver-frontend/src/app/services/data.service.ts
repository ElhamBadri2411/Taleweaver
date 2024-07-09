import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  private data: { [key: string]: string } = {};

  setOption(option: string, value: string) {
    this.data[option] = value;
  }

  reomveOption(option: string) {
    delete this.data[option];
  }

  getOption(option: string): string {
    return this.data[option];
  }

}
