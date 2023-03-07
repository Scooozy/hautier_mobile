import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddDemandeContactPage } from './addDemande';

@NgModule({
  declarations: [
    AddDemandeContactPage,
  ],
  imports: [
    IonicPageModule.forChild(AddDemandeContactPage),
  ],
  exports: [AddDemandeContactPage]
})
export class AddDemandeContactPageModule {}
