// Angular core
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LongPressModule } from 'ionic-long-press';

// Page
import { HomePage } from './home';

@NgModule({
  declarations: [ HomePage ],
  imports: [
    IonicPageModule.forChild(HomePage),
    LongPressModule
  ],
  exports: [ HomePage ]
})
export class HomePageModule { }
