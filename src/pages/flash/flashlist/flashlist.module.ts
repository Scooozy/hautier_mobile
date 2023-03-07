import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FlashlistPage } from './flashlist';

@NgModule({
  declarations: [
    FlashlistPage,
  ],
  imports: [
    IonicPageModule.forChild(FlashlistPage),
  ],
})
export class FlashlistPageModule {}
