import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EventsFormulairePage } from './formulaire';

@NgModule({
  declarations: [
    EventsFormulairePage,
  ],
  imports: [
    IonicPageModule.forChild(EventsFormulairePage),
  ],
  exports: [EventsFormulairePage]
})
export class EventsFormulairePageModule {}
