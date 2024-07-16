import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor() { }
  private filter = new BehaviorSubject<string>('');
  private dataSubject = new BehaviorSubject<string>('');
  data$ = this.dataSubject.asObservable();
  filter$ = this.filter.asObservable();

  updateData(newData: string) {
    this.dataSubject.next(newData);
  }

  updateFilter(newFilter: string) {
    this.filter.next(newFilter);
  }
}
