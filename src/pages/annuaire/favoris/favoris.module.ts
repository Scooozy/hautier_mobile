import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AnnuaireFavorisPage } from './favoris';

@NgModule({
  declarations: [
    AnnuaireFavorisPage,
  ],
  imports: [
    IonicPageModule.forChild(AnnuaireFavorisPage),
  ],
  exports: [AnnuaireFavorisPage]
})
export class AnnuaireFavorisPageModule {}
