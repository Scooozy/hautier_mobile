import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DemandeCongesPage } from './demande';

@NgModule({
  declarations: [
    DemandeCongesPage,
  ],
  imports: [
    IonicPageModule.forChild(DemandeCongesPage),
  ],
  exports: [DemandeCongesPage]
})
export class DemandeCongesPageModule {}
