import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetailsugContactPage } from './detailsug';

@NgModule({
  declarations: [
    DetailsugContactPage,
  ],
  imports: [
    IonicPageModule.forChild(DetailsugContactPage),
  ],
  exports: [DetailsugContactPage]
})
export class DetailsugContactPageModule {}
