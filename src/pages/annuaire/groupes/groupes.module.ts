import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AnnuaireGroupesPage } from './groupes';

@NgModule({
  declarations: [
    AnnuaireGroupesPage,
  ],
  imports: [
    IonicPageModule.forChild(AnnuaireGroupesPage),
  ],
  exports: [AnnuaireGroupesPage]
})
export class AnnuaireGroupesPageModule {}
