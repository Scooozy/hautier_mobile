import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SignalementsContactPage } from './signalements';

@NgModule({
  declarations: [
    SignalementsContactPage,
  ],
  imports: [
    IonicPageModule.forChild(SignalementsContactPage),
  ],
  exports: [SignalementsContactPage]
})
export class SignalementsContactPageModule {}
