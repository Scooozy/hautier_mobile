import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
import { Nav } from 'ionic-angular';
import {SQLite, SQLiteObject} from '@ionic-native/sqlite';
import * as $ from 'jquery';
import { AlertController } from 'ionic-angular';
import { ContactServiceProvider } from "../../../providers/contact-service/contact-service";
import {AnnuaireServiceProvider} from "../../../providers/annuaire-service/annuaire-service";
import {HomeServiceProvider} from "../../../providers/home-service/home-service";

@IonicPage()
@Component({
    selector: 'page-detailsug-contact',
    templateUrl: 'detailsug.html'
})

export class DetailsugContactPage {
  @ViewChild(Nav) nav: NavController;
  userContact: number;
  user:any;
  suggestion: any;
  details: any;
  like: string;
  icon:string;
  day:any;
  month:any;
  publication:string;
  likes:any;
  titre:string;
  name:string;
  prenom:string = "";
  nom:string = "";
  description:string;
  maybe:number;
  params: any;
  response:any;
  image: any;
  prix: any;
  participation: any;
  gratuit: any;
  date_publication: any;
  id_creator: any;
  id_suggestion: any;
  note: any;
  place: any;
  right_vote: boolean = false;

  constructor(public navCtrl: NavController, public Sqlite: SQLite, public contactSrv: ContactServiceProvider,
              public alertCtrl: AlertController, public navParams: NavParams, private annuaireSrv: AnnuaireServiceProvider,
              public homeSrv: HomeServiceProvider) {
      this.getUser();
      this.id_suggestion = this.navParams.get('id');
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

  public getUser(){
      this.Sqlite.create({
          name: 'ionicdb.db',
          location: 'default'
      }).then((db: SQLiteObject) => {
          db.executeSql('SELECT * FROM connectContact', {})
              .then(res => {
                  this.userContact = res.rows.item(0).id_user;
                  this.getContribution(this.navParams.get('id'),this.userContact);
              });
      });
  }

  public getContribution(id,id_user){
      this.contactSrv.getContribution(id,id_user).subscribe( data => {
        this.homeSrv.getHasRight(this.userContact,39).subscribe(data =>{
          this.right_vote = data;
        });
        this.details = data;
        this.details = this.details[0];
        this.titre = this.details.titre;
        this.description = this.details.description;
        this.id_creator = this.details.id_user;
        this.annuaireSrv.getEmployeById(this.id_creator).subscribe(data => {
            this.place = data[0];
            this.nom = this.place.nom;
            this.prenom = this.place.prenom;
            if(this.place.image != "") {
                $('#img_avatar').css("background-image", "url('https://hautier.teamsmart.fr/images/entreprise/profils/"+this.place.image+"')");
            }else{
                $('#img_avatar').css('display', 'block');
            }
        });
        this.prix = this.details.prix;
        this.participation = this.details.participation;
        this.gratuit = this.details.gratuit;
        this.date_publication = this.details.date_publication;
        this.like = this.details.like;
        this.note = this.details.note;

        if(this.note != null){
            for (let i = this.note; i > 0; i--) {
                $('#coeur-'+i).removeClass('icon-petit-camion');
                $('#coeur-'+i).addClass('icon-petit-camion-plein');
            }
            $('#note').text('Vous avez déjà voté.').show()
        }

      });
  }

  public goBack(){
      this.navCtrl.setRoot('SuggestionsContactPage',{
          id_cli: this.navParams.get('id_cli')
      });
  }

  public onclickCoeur(id){
      $('.coeur').addClass('icon-petit-camion');
      $('.coeur').removeClass('icon-petit-camion-plein');
      var note = id;
      var id_suggestion = this.id_suggestion;
      var id_user = this.userContact;
      for (let i = note; i > 0; i--) {
          $('#coeur-'+i).removeClass('icon-petit-camion');
          $('#coeur-'+i).addClass('icon-petit-camion-plein');
      }

      this.contactSrv.likeContribution(id_suggestion,id_user,note).subscribe(() => {
          this.note = note;
          $('#note').text('Vote bien enregistré.').show()
      });
  }

  public openProfil(){
      this.navCtrl.setRoot('place-detail',{
          param: this.place.id,
          idCat: 'team',
          way: 'detailsuggestion',
          id_contribution: this.navParams.get('id'),
          id_cli : this.navParams.get('id_cli')
      });
  }


}
