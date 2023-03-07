import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomeContactPage } from './home';

@NgModule({
  declarations: [
    HomeContactPage,
  ],
  imports: [
    IonicPageModule.forChild(HomeContactPage),
  ],
  exports: [HomeContactPage]
})
export class HomeContactPageModule {}
