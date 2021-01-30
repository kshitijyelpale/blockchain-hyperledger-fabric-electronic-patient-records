import { Component, Input, OnInit, OnDestroy } from '@angular/core';

import { SearchComponent } from './search.component';
import { SearchService } from './search.service';

import { Subscription } from 'rxjs/internal/Subscription';

export interface SearchComboConfig {
  value: string;
  name: string;
}

@Component({
  selector: 'app-search-combo',
  templateUrl: './search-combo.component.html',
  styleUrls: ['./search-combo.component.scss']
})
export class SearchComboComponent extends SearchComponent implements OnInit, OnDestroy {
  @Input()
  public selectedItem = '';
  @Input()
  public config: SearchComboConfig[] | undefined;
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
        this.selectedItem = '';
      } else {
        this.selectedItem = value;
        this.searchService.initParam(this.parameterName, this.selectedItem);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.paramSub) {
      this.paramSub.unsubscribe();
    }
  }

  onSelectionChanged(newSelection: Event): void {
    this.selectedItem = (newSelection.target as HTMLInputElement).value;
    this.searchService.updateParam(this.parameterName, this.selectedItem);
  }
}
