import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConnectContactPage } from './connect';

@NgModule({
  declarations: [
    ConnectContactPage,
  ],
  imports: [
    IonicPageModule.forChild(ConnectContactPage),
  ],
  exports: [ConnectContactPage]
})
export class AnnuairePageModule {}
