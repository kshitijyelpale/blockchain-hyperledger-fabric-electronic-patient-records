import {Component, Input} from '@angular/core';

@Component({
  template : ``
})
export abstract class SearchComponent {
  @Input() public parameterName = '';
  @Input() public placeholder = '';
  @Input() public pattern: string | RegExp = '';
  @Input() public debounceTime = 500;
  @Input() public help: string | null = null;
}
