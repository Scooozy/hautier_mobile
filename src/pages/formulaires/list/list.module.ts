import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FormsListPage } from './list';

@NgModule({
  declarations: [
    FormsListPage,
  ],
  imports: [
    IonicPageModule.forChild(FormsListPage),
  ],
  exports: [FormsListPage]
})
export class FormsListPageModule {}
