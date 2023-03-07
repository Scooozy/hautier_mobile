import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
import { NewsServiceProvider } from '../../../providers/news-services/news-services';
import * as $ from 'jquery';
import { SQLite} from "@ionic-native/sqlite";
import { SqliteServiceProvider } from '../../../providers/sqlite-service/sqlite-service';
import { AnnuaireServiceProvider } from '../../../providers/annuaire-service/annuaire-service';
import { ContactServiceProvider } from "../../../providers/contact-service/contact-service";
import 'rxjs/add/operator/map';
import {HomeServiceProvider} from "../../../providers/home-service/home-service";

@IonicPage()
@Component({
  selector: 'page-news-comment',
  templateUrl: 'comment.html'
})

export class NewsComment {

  lesComments: any;
  reponseComment: any  =[];
  comment: string;
  id_actu : number = this.navParams.get('id_actu');
  nb_comment: number;
  id_user: number = this.navParams.get('id_user');
  name_sender: string[] = [];
  right_read_comment: boolean = false;
  right_comment: boolean = false;



  constructor(public navCtrl: NavController, public contactSrv: ContactServiceProvider, public annuaire:AnnuaireServiceProvider,
              public newsSrv: NewsServiceProvider, public Sqlite: SQLite, public sqlite: SqliteServiceProvider,
              public navParams: NavParams, private homeSrv: HomeServiceProvider) {

    this.getComments();
  }

  private getComments(){
    this.homeSrv.getHasRight(this.id_user,9).subscribe(data => {
      this.right_read_comment = data;
    });
    this.homeSrv.getHasRight(this.id_user,8).subscribe(data => {
      this.right_comment = data;
    });
    this.newsSrv.getCommentActu(this.id_actu).subscribe(data => {
      this.lesComments = data;
      this.nb_comment = this.lesComments.length;

      for(let i = 0; i<data.length; i++){
        this.annuaire.getEmployeById(data[i].id_user).subscribe(data2 =>{
          this.name_sender[i] = data2[0].prenom+" "+data2[0].nom;
          if(data2[0].image != ""){
            $('#img_avatar_'+i).css("background-image", "url('https://hautier.teamsmart.fr/images/entreprise/profils/"+data2[0].image+"')");
          }else{
            $('#img_avatar_'+i+' ion-icon').show();
            $('#img_avatar_'+i).css("background-color", "#E0E0E0");
          }
        });
      }
    });
  }

  ionViewWillEnter(){
    let self = this;
    //Add click on class myBackArrow
    $(function() {
      $(".myBackArrow").click(function() {
        self.goBack();
      });
    });
  }

  ionViewWillLeave(){
    //Remove all delegated click handlers
    $(".myBackArrow").off();
  }

  public saveComment(){
    this.reponseComment.push({
      id_actu : this.id_actu,
      comment : this.comment,
      id_user: this.id_user
    });

    this.newsSrv.postCommentActu(JSON.stringify(this.reponseComment)).then(data => {
      let response = data;
      $('#input_comment').val('');
      this.getComments();

    });
  }

  public checkvalid(){
    if(this.comment != "" || this.comment != null || this.comment != undefined)
    {
      $("#submit_button").prop("disabled",false);
    }else{
      $("#submit_button").prop("disabled",true);
    }
  }

  //Convert Date to readable date
  public dateForComment(dateString) {
    let d = new Date(dateString);

    var datestring = ("0" + d.getDate()).slice(-2) + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" +
    d.getFullYear() + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);

    return datestring;
  }

  public goBack() {
    this.navCtrl.setRoot('news-list', {
      id_ent: this.navParams.get('id_ent'),
      id_ent_post: this.navParams.get('id_ent_post'),
      ancre: this.navParams.get('ancre'),
        typeActu: this.navParams.get('typeActu')
    });
  }
}
