import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationDialogComponent } from './confirm-dialog/confirmation-dialog.component';
import { ConfirmationDialogService } from './confirm-dialog/confirmation-dialog.service';



@NgModule({
  declarations: [ ConfirmationDialogComponent ],
  imports: [ CommonModule ],
  providers: [ ConfirmationDialogService ]
})
export class CoreModule { }
