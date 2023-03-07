import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RepondreContactPage } from './repondre';

@NgModule({
  declarations: [
    RepondreContactPage,
  ],
  imports: [
    IonicPageModule.forChild(RepondreContactPage),
  ],
  exports: [RepondreContactPage]
})
export class RepondreContactPageModule {}
