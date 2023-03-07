import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RendezVousEventPage } from './rendez_vous';

@NgModule({
  declarations: [
    RendezVousEventPage,
  ],
  imports: [
    IonicPageModule.forChild(RendezVousEventPage),
  ],
  exports: [RendezVousEventPage]
})
export class RendezVousEventPageModule {}
