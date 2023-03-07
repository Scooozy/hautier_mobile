import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FormulairePage } from './formulaire';

@NgModule({
  declarations: [
    FormulairePage,
  ],
  imports: [
    IonicPageModule.forChild(FormulairePage),
  ],
  exports: [FormulairePage]
})
export class FormulairePageModule {}
