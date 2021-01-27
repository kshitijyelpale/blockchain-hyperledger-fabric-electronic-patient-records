import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: `app-confirmation-dialog`,
  templateUrl: 'confirmation-dialog.component.html'
})
export class ConfirmationDialogComponent implements OnInit {
  @Input() headerText = '';
  @Input() message = '';
  @Input() headerIconClass = '';
  @Input() btnOkText = '';
  @Input() btnCancelText = '';

  constructor(private activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  public decline(): void {
    this.activeModal.close(false);
  }

  public accept(): void {
    this.activeModal.close(true);
  }

  public dismiss(): void {
    this.activeModal.dismiss();
  }

}
