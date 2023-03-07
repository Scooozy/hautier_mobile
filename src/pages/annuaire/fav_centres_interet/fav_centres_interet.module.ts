import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AnnuaireFavCentresInteretPage } from './fav_centres_interet';

@NgModule({
  declarations: [
    AnnuaireFavCentresInteretPage,
  ],
  imports: [
    IonicPageModule.forChild(AnnuaireFavCentresInteretPage),
  ],
  exports: [AnnuaireFavCentresInteretPage]
})
export class AnnuaireFavCentresInteretPageModule {}
