import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetaildemContactPage } from './detaildem';

@NgModule({
  declarations: [
    DetaildemContactPage,
  ],
  imports: [
    IonicPageModule.forChild(DetaildemContactPage),
  ],
  exports: [DetaildemContactPage]
})
export class DetaildemContactPageModule {}
