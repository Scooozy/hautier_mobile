import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListEntreprisesPage } from './listEntreprises';

@NgModule({
  declarations: [
    ListEntreprisesPage,
  ],
  imports: [
    IonicPageModule.forChild(ListEntreprisesPage),
  ],
  exports: [ListEntreprisesPage]
})
export class ListEntreprisesPageModule {}
