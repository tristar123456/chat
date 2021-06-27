import {Injectable} from "@angular/core";
import {Observable, Subject} from "rxjs";
import {SCREEN_SIZE} from "./screen-size.enum";
import {distinctUntilChanged} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ResizeService {
  private currentVal: number| undefined;

  get onResize$(): Observable<SCREEN_SIZE> {
    return this.resizeSubject.asObservable().pipe(distinctUntilChanged());
  }

  private resizeSubject: Subject<SCREEN_SIZE>;

  constructor() {
    this.resizeSubject = new Subject();
    this.resizeSubject.subscribe(size => {
      this.currentVal = size;
    });
  }

  get current(){
    return this.currentVal;
  }

  onResize(size: SCREEN_SIZE) {
    this.resizeSubject.next(size);
  }

}
