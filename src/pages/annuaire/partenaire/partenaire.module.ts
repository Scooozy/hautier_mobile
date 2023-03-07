import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PartenairePage } from './partenaire';

@NgModule({
  declarations: [
    PartenairePage,
  ],
  imports: [
    IonicPageModule.forChild(PartenairePage),
  ],
  exports: [PartenairePage]
})
export class PartenairePageModule {}
