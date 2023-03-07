import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModifDetailsPage } from './modif_details';

@NgModule({
  declarations: [
    ModifDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(ModifDetailsPage),
  ],
  exports: [ModifDetailsPage]
})
export class ModifDetailsPageModule {}
