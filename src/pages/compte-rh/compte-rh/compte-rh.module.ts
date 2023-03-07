import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CompteRhPage } from './compte-rh';

@NgModule({
  declarations: [
    CompteRhPage,
  ],
  imports: [
    IonicPageModule.forChild(CompteRhPage),
  ],
  exports: [CompteRhPage]
})
export class CompteRhPageModule {}
