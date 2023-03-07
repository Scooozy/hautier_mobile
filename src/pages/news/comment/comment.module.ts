import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewsComment } from './comment';

@NgModule({
  declarations: [
    NewsComment,
  ],
  imports: [
    IonicPageModule.forChild(NewsComment),
  ],
  exports: [NewsComment]
})
export class NewsCommentModule {}
