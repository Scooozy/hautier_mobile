import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AnnuaireCentresInteretPage } from './centres_interet';

@NgModule({
  declarations: [
    AnnuaireCentresInteretPage,
  ],
  imports: [
    IonicPageModule.forChild(AnnuaireCentresInteretPage),
  ],
  exports: [AnnuaireCentresInteretPage]
})
export class AnnuaireCentresInteretPageModule {}
