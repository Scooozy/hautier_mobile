import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FormsDetailDemReparationPage } from './detail-dem-reparation';

@NgModule({
  declarations: [
    FormsDetailDemReparationPage,
  ],
  imports: [
    IonicPageModule.forChild(FormsDetailDemReparationPage),
  ],
  exports: [FormsDetailDemReparationPage]
})
export class FormsDetailDemReparationPageModule {}
