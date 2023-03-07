import { Component } from '@angular/core';
import { ContentserviceProvider } from '../../../providers/contentservice/contentservice';
import * as $ from 'jquery';
import {IonicPage} from "ionic-angular";

@IonicPage()
@Component({
  selector: 'page-motmaire',
  templateUrl: 'motmaire.html'
})
export class MotMairePage {
  _content: string;

  constructor(private content: ContentserviceProvider) {
    this.getMotMaire();
  }

  getMotMaire(){
    /*this.content.getMotMaire(91).subscribe(data => {
      this._content = data[0].introtext;
      //this._content = this._content[0].introtext;
      $('#contentMaire').html(this._content);
    });*/
  }

}
