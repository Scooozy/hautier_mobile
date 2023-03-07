import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FormsDetailPage } from './detail';

@NgModule({
  declarations: [
    FormsDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(FormsDetailPage),
  ],
  exports: [FormsDetailPage]
})
export class FormsDetailPageModule {}
