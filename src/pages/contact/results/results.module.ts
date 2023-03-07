import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ResultsContactPage } from './results';

@NgModule({
  declarations: [
    ResultsContactPage,
  ],
  imports: [
    IonicPageModule.forChild(ResultsContactPage),
  ],
  exports: [ResultsContactPage]
})
export class ResultsContactPageModule {}
