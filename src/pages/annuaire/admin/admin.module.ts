// Angular core
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

// Page
import { AdminPage } from './admin';

@NgModule({
  declarations: [ AdminPage ],
  imports: [ IonicPageModule.forChild(AdminPage) ],
  exports: [ AdminPage ]
})
export class AdminPageModule { }
