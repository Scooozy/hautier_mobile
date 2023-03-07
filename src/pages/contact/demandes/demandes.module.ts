import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DemandesContactPage } from './demandes';

@NgModule({
  declarations: [
    DemandesContactPage,
  ],
  imports: [
    IonicPageModule.forChild(DemandesContactPage),
  ],
  exports: [DemandesContactPage]
})
export class DemandesContactPageModule {}
