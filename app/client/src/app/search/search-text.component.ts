import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { NgForm } from '@angular/forms';


import { Subject, Subscription} from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { SearchComponent } from './search.component';
import { SearchService } from './search.service';

@Component({
  selector: 'app-search-text',
  templateUrl: './search-text.component.html',
  styleUrls: ['./search-text.component.scss']
})
export class SearchTextComponent extends SearchComponent implements OnInit, OnDestroy {

  public searchTermChangedDebounced: Subject<string> = new Subject<string>();
  @Input()
  public searchTerm = '';
  private subscription: Subscription | null = null;
  private paramSub: Subscription | undefined;

  constructor(
    private readonly searchService: SearchService
  ) {
    super();
  }

  ngOnInit(): void {
    this.paramSub = this.searchService.onParamsChanged.subscribe(params => {
      const value = params[this.parameterName];
      if (value === undefined) {
        this.searchTerm = '';
      } else {
        this.searchTerm = value;
        this.searchService.initParam(this.parameterName, this.searchTerm);
      }
    });

    this.subscription = this.searchTermChangedDebounced
      // wait 500ms after the last event before emitting last event
      .pipe(
        debounceTime(this.debounceTime)
      ).subscribe(x => {
        this.searchService.updateParam(this.parameterName, x);
      });
  }

  ngOnDestroy(): void {
    if (this.paramSub) {
      this.paramSub.unsubscribe();
    }
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public changedSearchTerm(text: string, form: NgForm): void {
    if (form.valid) {
      this.searchTermChangedDebounced.next(text);
    }
  }
}
