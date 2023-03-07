import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MotMairePage } from './motmaire';

@NgModule({
  declarations: [
    MotMairePage,
  ],
  imports: [
    IonicPageModule.forChild(MotMairePage),
  ],
  exports: [MotMairePage]
})
export class MotMairePageModule {}
