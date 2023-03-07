import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PartenairedetailPage } from './partenaire_detail';

@NgModule({
  declarations: [
    PartenairedetailPage,
  ],
  imports: [
    IonicPageModule.forChild(PartenairedetailPage),
  ],
  exports: [PartenairedetailPage]
})
export class PartenairedetailPageModule {}
