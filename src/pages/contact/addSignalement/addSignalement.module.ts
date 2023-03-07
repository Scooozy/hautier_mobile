import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddSignalementContactPage } from './addSignalement';

@NgModule({
  declarations: [
    AddSignalementContactPage,
  ],
  imports: [
    IonicPageModule.forChild(AddSignalementContactPage),
  ],
  exports: [AddSignalementContactPage]
})
export class AddSignalementContactPageModule {}
