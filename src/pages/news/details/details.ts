import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
import { NewsServiceProvider } from '../../../providers/news-services/news-services';
import * as $ from 'jquery';
import {SQLiteObject, SQLite} from "@ionic-native/sqlite";
import { SqliteServiceProvider } from '../../../providers/sqlite-service/sqlite-service';

@IonicPage({
  name : 'news-detail',
  segment : 'news-detail'
})
@Component({
  selector: 'page-news-details',
  templateUrl: 'details.html'
})

export class NewsDetailsPage {
  new : any;
  title : string;
  created : string;
  introtext : string;
  fulltext : string;

  constructor(public navCtrl: NavController, public navParam: NavParams, public newsSrv: NewsServiceProvider,
    public Sqlite: SQLite, public sqlite: SqliteServiceProvider) {
    this.getNew(this.navParam.get('param'));
    this.getNewsNotif();
  }

  public getNew(id){
    this.newsSrv.getNew(id).subscribe(data => {
      this.new = data[0];
      this.title = this.new.title;
      $('#short-desc-detail').html(this.new.introtext);
      $('#desc-detail').html(this.new.fulltext);

      $('#head-pic').css("backgroundImage","url('http://prodentreprise.citybay.fr/media/k2/items/cache/"+this.new.img+"'");

      let months = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
      var date = this.new.created.split(' ');
      date = date[0].split('-');
      var day = date[2];
      var month = months[parseInt(date[1])];
      this.created = 'Article du  '+ day + ' ' + month + ' ' + date[0];
      $('#loader-news-detail').css('display','none');
      $('#load-news-detail').css('display','none');
      $('#load-news, #loader-news').hide();
    });
  }

  public getNewsNotif(){
    this.Sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('SELECT * FROM notifNews', {})
      .then(res => {
        if(res.rows.length == 0){
            //save
            this.sqlite.saveNews(1, this.navParam.get('param'));
          }else if(this.navParam.get('param') > res.rows.item(0).id_news){
            //update
            this.sqlite.updateNews(res.rows.item(0).id, this.navParam.get('param'));
          }
        });
    });
  }

  public goBackToList(){
    this.navCtrl.setRoot('news-list', []);
  }

}
