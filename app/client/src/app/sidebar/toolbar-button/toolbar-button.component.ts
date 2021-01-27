import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-toolbar-button',
  templateUrl: './toolbar-button.component.html',
  styleUrls: ['./toolbar-button.component.scss']
})
export class ToolbarButtonComponent {
  @Input() public icon = '';
  @Input() public text = '';
  @Input() public isLoading = false;
  @Input() public click: any;
  @Input() public disabled = false;
}
