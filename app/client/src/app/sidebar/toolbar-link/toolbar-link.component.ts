import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-toolbar-link',
  templateUrl: './toolbar-link.component.html',
  styleUrls: ['./toolbar-link.component.scss']
})
export class ToolbarLinkComponent {
  @Input() public icon = '';
  @Input() public text = '';
  @Input() public routerLink: string | string[] | undefined;
  @Input() public queryParams: any;
}
