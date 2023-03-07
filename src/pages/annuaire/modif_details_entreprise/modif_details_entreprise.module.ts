import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModifDetailsPageEntreprise } from './modif_details_entreprise';

@NgModule({
  declarations: [
    ModifDetailsPageEntreprise,
  ],
  imports: [
    IonicPageModule.forChild(ModifDetailsPageEntreprise),
  ],
  exports: [ModifDetailsPageEntreprise]
})
export class ModifDetailsPageEntrepriseModule {}
