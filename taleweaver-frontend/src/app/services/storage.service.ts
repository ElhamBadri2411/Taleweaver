import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators'; // Add this line

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private currentStorage = new BehaviorSubject({});
  private storage: { [key: string]: any } = {};

  constructor() {
     this.updateSubject();
  }
 
   set(key: string, value: any){
     this.storage[key] = value;
     this.updateSubject();
   }
 
   updateSubject(){
     this.currentStorage.next({...this.storage})
   }
 
   get(key: string){
     return this.storage[key];
   }

   delete(key: string){
      delete this.storage[key];
      this.updateSubject();
   }
 
   watch(key: string){
    return this.currentStorage.pipe( map( (storage: any) => storage[key]) );
   } 
}
