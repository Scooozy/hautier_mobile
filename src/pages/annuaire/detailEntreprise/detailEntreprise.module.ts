import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetailEntreprisePage } from './detailEntreprise';

@NgModule({
  declarations: [
    DetailEntreprisePage,
  ],
  imports: [
    IonicPageModule.forChild(DetailEntreprisePage),
  ],
  exports: [DetailEntreprisePage]
})
export class DetailEntreprisePageModule {}
