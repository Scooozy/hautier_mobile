import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SuggestionsContactPage } from './suggestions';

@NgModule({
  declarations: [
    SuggestionsContactPage,
  ],
  imports: [
    IonicPageModule.forChild(SuggestionsContactPage),
  ],
  exports: [SuggestionsContactPage]
})
export class SuggestionsContactPageModule {}
