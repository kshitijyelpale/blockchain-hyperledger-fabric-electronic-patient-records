import { Injectable } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ConfirmationDialogComponent } from './confirmation-dialog.component';

@Injectable()
export class ConfirmationDialogService {

  constructor(private modalService: NgbModal) { }

  public confirm(
    headerText: string,
    message: string,
    headerIconClass: string = '',
    btnConfirmText: string = 'Confirm',
    btnCancelText: string = 'Cancel',
    dialogSize: 'sm'|'lg' = 'sm'
  ): Promise<boolean> {
    const modalRef = this.modalService.open(ConfirmationDialogComponent, { size: dialogSize });
    modalRef.componentInstance.headerText = headerText;
    modalRef.componentInstance.message = message;
    modalRef.componentInstance.headerIconClass = headerIconClass;
    modalRef.componentInstance.btnOkText = btnConfirmText;
    modalRef.componentInstance.btnCancelText = btnCancelText;

    return modalRef.result;
  }

}
