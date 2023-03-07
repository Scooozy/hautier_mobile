import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SondageContactPage } from './sondage';

@NgModule({
  declarations: [
    SondageContactPage,
  ],
  imports: [
    IonicPageModule.forChild(SondageContactPage),
  ],
  exports: [SondageContactPage]
})
export class SondageContactPageModule {}
