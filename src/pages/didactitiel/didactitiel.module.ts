import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DidactitielPage } from './didactitiel';

@NgModule({
  declarations: [
    DidactitielPage,
  ],
  imports: [
    IonicPageModule.forChild(DidactitielPage),
  ],
  exports: [DidactitielPage]
})
export class DidactitielPageModule {}
