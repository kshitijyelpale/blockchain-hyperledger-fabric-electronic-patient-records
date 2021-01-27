import { BehaviorSubject } from 'rxjs';

import { Injectable,  } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';


// It is important to reset the SearchService in every component's OnInit, because it has state.
// Search parameters of any previous search would otherwise still be available in the service.
// Currently i could not find a better solution than implementing the reset() function
@Injectable({
  providedIn: 'root'
})
export class SearchService {

  public readonly onParamsChanged = new BehaviorSubject<Params>({});

  public currentQuery = '';

  private queryParams = new Map<string, string | null>();

  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.queryParams.subscribe( params => {
      this.queryParams = new Map(Object.entries(params));
      this.onParamsChanged.next(params);
    });
  }

  initParam(parameterName: string, query: string | null): void {
    if (query) {
      this.queryParams.set(parameterName, query);
    } else {
      this.queryParams.delete(parameterName);
    }
  }

  updateParam(parameterName: string, query: string | null): void {
    if (query) {
      this.queryParams.set(parameterName, query);
    } else {
      this.queryParams.delete(parameterName);
    }

    const params = this.formatParamObject();

    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: params
    });
  }

  private formatParamObject(): any {
    const params = {};
    this.queryParams.forEach((v, k) => {
      if (v) {
        // @ts-ignore
        params[k] = v;
      }
    });
    return params;
  }

  reset(): void {
    this.queryParams.clear();
  }
}
