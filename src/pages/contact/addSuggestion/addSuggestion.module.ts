import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddSuggestionContactPage } from './addSuggestion';

@NgModule({
  declarations: [
    AddSuggestionContactPage,
  ],
  imports: [
    IonicPageModule.forChild(AddSuggestionContactPage),
  ],
  exports: [AddSuggestionContactPage]
})
export class AddSuggestionContactPageModule {}
