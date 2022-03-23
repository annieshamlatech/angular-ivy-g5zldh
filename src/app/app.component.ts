import { Component, VERSION, Input } from '@angular/core';

import {BehaviorSubject, Subject, timer} from 'rxjs';
import { switchMap, map, takeUntil, tap} from 'rxjs/operators'

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  name = 'Angular ' + VERSION.major;
    initialMinutes$ = new BehaviorSubject(30);
  expired$ = new Subject();

  @Input()
  set minutes(val) {
    this.initialMinutes$.next(val);
  }

  timer$ = this.initialMinutes$.pipe(
    switchMap(minutes => timer(0, 1000).pipe(
      map(t => minutes * 60 - t),
      tap(seconds => {
        if (seconds < 0) {
          this.expired$.next();
        }
      }),
      takeUntil(this.expired$),
      map(seconds => ({
        hr: Math.max(Math.floor(seconds / 3600), 0),
        min: Math.max(Math.floor((seconds % 3600) / 60), 0),
        s: (seconds % 60)
      })),
      map(({hr, min, s}) => ([
        hr > 9 ? hr.toString() : '0' + hr.toString(),
        min > 9 ? min.toString() : '0' + min.toString(),
        s > 9 ? s.toString() : '0' + s.toString(),
      ]))
    ))
  );
}
