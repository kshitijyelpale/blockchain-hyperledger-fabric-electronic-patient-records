import { Pipe, PipeTransform } from '@angular/core';

import { isObservable, of } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';

@Pipe({
  name: 'loading'
})
export class LoadingPipe implements PipeTransform {

  transform(value: any): any {
    return isObservable(value)
      ? value.pipe(
        map((mappedValue: any) => ({ loading: false, value: mappedValue })),
        startWith({ loading: true }),
        catchError(error => of({ loading: false, error}))
      )
      : value;
  }

}
