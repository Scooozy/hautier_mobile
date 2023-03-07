import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetailsigContactPage } from './detailsig';

@NgModule({
  declarations: [
    DetailsigContactPage,
  ],
  imports: [
    IonicPageModule.forChild(DetailsigContactPage),
  ],
  exports: [DetailsigContactPage]
})
export class DetailsigContactPageModule {}
