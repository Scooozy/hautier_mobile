import { Component, ViewChild } from '@angular/core';
import {AlertController, LoadingController, NavController, NavParams, Select, ToastController, IonicPage} from 'ionic-angular';
import { NewsServiceProvider } from '../../../providers/news-services/news-services';
import * as $ from 'jquery';
import {SQLiteObject, SQLite} from "@ionic-native/sqlite";
import { SqliteServiceProvider } from '../../../providers/sqlite-service/sqlite-service';
import { AnnuaireServiceProvider } from '../../../providers/annuaire-service/annuaire-service';
import { EventsServiceProvider } from '../../../providers/events-service/events-service';
import { ContactServiceProvider } from "../../../providers/contact-service/contact-service";
import { FacebookService } from '../../../providers/facebook-service/facebook-service';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';
import {HomeServiceProvider} from "../../../providers/home-service/home-service";
import {InAppBrowser} from "@ionic-native/in-app-browser";
import { Gesture } from 'ionic-angular';

@IonicPage({
  name : 'news-list',
  segment : 'news-list'
})
@Component({
  selector: 'page-news-list',
  templateUrl: 'list.html'
})

export class NewsListPage {
  lesReponsesPosts: any[];
  @ViewChild('SelectCat') monSelectCat: Select;
  private gesture: Gesture;
  @ViewChild('imageParent') elementParent;
  @ViewChild('image') element;
  news: any;
  date: any;
  today: any;
  twitterAccount: string;
  id_creator: number;
  place: any;
  events: any;
  event: any;
  actu = [];
  tweets:any;
  tweets2: any;
  userContact:number;
  posts: any;
  monPost: any;

  endTweet: boolean = true;
  endTweet2: boolean = true;
  endNew: boolean = false;
  endPost: boolean = false;
  fsc: boolean;
  id_ent: any;
  ent_selected: any;
  id_ent_post: any;
  typeActuFilter: string = 'all';
  img_post: string;
  bgImage: any;
  user_info: any;
  typeActu: string;
  right_comment: boolean = false;
  right_like: boolean = false;
  right_read_comment: boolean = false;

  image = null;
  container: any = null;
  transforms: any = [];
  adjustScale: any = 1;
  adjustDeltaX: any = 0;
  adjustDeltaY: any = 0;
  currentScale : any= null;
  currentDeltaX: any = null;
  currentDeltaY: any = null;


  constructor(public navCtrl: NavController,private storage: Storage, public contactSrv: ContactServiceProvider,
              public annuaire:AnnuaireServiceProvider,public eventSrv:EventsServiceProvider, public newsSrv: NewsServiceProvider,
              public Sqlite: SQLite, public sqlite: SqliteServiceProvider, public facebook:FacebookService,
              public navParams: NavParams, public toastCtrl : ToastController, public alertCtrl: AlertController,
              public loadingCtrl: LoadingController, private homeSrv: HomeServiceProvider, public appBrowser : InAppBrowser) {

    this.today = new Date();
    this.id_ent = this.navParams.get('id_ent');
    this.id_ent_post = this.navParams.get('id_ent_post');
    this.typeActu = this.navParams.get('typeActu');
  }

  ionViewWillEnter(){
    this.getUser();
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

  ionViewDidLoad(){
    this.image = this.element.nativeElement;
    this.container = this.elementParent.nativeElement;
    //create gesture obj w/ ref to DOM element
    this.gesture = new Gesture(this.element.nativeElement);
    console.log('GESTURE',this.gesture);

    //listen for the gesture
    this.gesture.listen();

    //turn on listening for pinch or rotate events
    this.gesture.on('pinch', e => this.pinchEvent(e));
    this.gesture.on('pan', e => this.panEvent(e));

    this.gesture.on('doubletap', (e) => this.doubleTapEvent(e));
  }

  private panEvent(e){
    //this.transforms = [];
    if(this.currentScale > 1){
      this.currentDeltaX = (this.adjustDeltaX + (e.deltaX / this.currentScale))/10;
      this.currentDeltaY = (this.adjustDeltaY + (e.deltaY / this.currentScale))/10;
      this.transforms.push('translate(' + this.currentDeltaX + 'px,' + this.currentDeltaY + 'px)');
      this.container.style.transform = this.transforms.join(' ');
    }
  }
  
  private doubleTapEvent(ev){
    this.transforms = [];
      this.adjustScale += 1;
      if (this.adjustScale >= 4) this.adjustScale = 1;
      this.transforms.push('scale(' + this.adjustScale + ')');
      this.container.style.transform = this.transforms.join(' ');
  }

  private pinchEvent(ev) {
      this.transforms = [];

      // Adjusting the current pinch/pan event properties using the previous ones set when they finished touching
      this.currentScale = this.adjustScale * ev.scale;
      this.currentDeltaX = this.adjustDeltaX + (ev.deltaX / this.currentScale);
      this.currentDeltaY = this.adjustDeltaY + (ev.deltaY / this.currentScale);

      // Concatinating and applying parameters.
      if (this.currentScale < 1) {
        this.currentScale = 1;
        this.currentDeltaX = 0;
        this.currentDeltaY = 0;
      }
      this.transforms.push('scale(' + this.currentScale + ')');
      this.transforms.push('translate(' + this.currentDeltaX + 'px,' + this.currentDeltaY + 'px)');
      this.container.style.transform = this.transforms.join(' ');
  }

  public getUser(){
    this.Sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('SELECT * FROM connectContact', {})
      .then(res => {
        this.userContact = res.rows.item(0).id_user;
        this.saveReadNews(this.typeActu, this.userContact);
        this.homeSrv.getHasRight(this.userContact,6).subscribe( data => {
          if(!data){
            this.presentToast("Vous n'avez pas les droits d'accès à cette fonctionnalité.");
            this.navCtrl.setRoot('home-home',{});
          }else{
            this.homeSrv.getHasRight(this.userContact,8).subscribe( data => {
              this.right_comment = data;
            });
            this.homeSrv.getHasRight(this.userContact,9).subscribe( data => {
              this.right_read_comment = data;
            });
            this.homeSrv.getHasRight(this.userContact,12).subscribe( data => {
              this.right_like = data;
            });
          }
        });
        this.homeSrv.getHasRight(this.userContact,6).subscribe( data => {
          if(!data){
            this.presentToast("Vous n'avez pas les droits d'accès à cette fonctionnalité.");
            this.navCtrl.setRoot('home-home',{});
          }
        });
        this.annuaire.getEmployeById(this.userContact).subscribe(data => {
            this.user_info = data[0];
            if(this.user_info.image != undefined){
                this.bgImage = "https://hautier.teamsmart.fr/images/entreprise/profils/"+this.user_info.image;
            }
            this.id_ent = this.user_info['id_entreprise'];
        });
        db.executeSql('SELECT * FROM ent_selected', {}).then(res => {
          this.ent_selected = res.rows.item(0).id_ent;
          this.getData(this.ent_selected);
        });
      });
    });
  }

  public goBack(){
    this.navCtrl.setRoot('home-home');
  }

  public setFilter(){
    this.actu = [];
    if(this.fsc){
      this.getData(this.id_ent);
    }else{
      this.getUser();
    }
  }

  //Ouvre le filtre
  public openFilter(){
    this.monSelectCat.open();
  }


  //Convert Date to readable date
  public dateForActu(dateString) {
    let d = new Date(dateString);
    if(d.toString() == "Invalid Date"){
      let date = (dateString).split(" ");
      let date1 = date[0].split('-');
      let heure = date[1].split(':');
      d = new Date(date1[0], date1[1]-1, date1[2], heure[0], heure[1], heure[2]);
    }

    var datestring = ("0" + d.getDate()).slice(-2) + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + d.getFullYear() + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
    return datestring;
  }

  public isImg(img){
    if(img == '' || img == null){
      return false;
    }else{
      var file_t = img.split('.');
      if(file_t[(file_t.length)-1] == 'pdf' || file_t[(file_t.length)-1] == 'PDF'){
        return false;
      }else{
        return true;
      }
    }
  }

  public isPDF(img){
    if(img == '' || img == null){
      return false;
    }else{
      var file_t = img.split('.');
      if(file_t[(file_t.length)-1] == 'pdf' || file_t[(file_t.length)-1] == 'PDF'){
        return true;
      }else{
        return false;
      }
    }
  }

  public getData(id_ent) {
    this.actu = [];
    this.newsSrv.getNews(id_ent).subscribe(data => {
      this.news = data;
      for(let i = 0; i < this.news.length; i ++){
        this.actu.push({
          type: "new",
          id: this.news[i].id,
          id_creator: this.news[i].created_by,
          nameAuthor: this.news[i].created_by_alias,
          date: this.news[i].created,
          titre: this.news[i].title,
          description: this.news[i].introtext,
          image: "https://hautier.teamsmart.fr/media/k2/items/cache/"+this.news[i].img,
          avatar: null,
          jour:Math.round(new Date(this.news[i].created).getTime()/1000.0),
          nb_like: 0
        });
      }
      this.endNew = true;
    });

    if(this.typeActu == "groupe"){
        this.annuaire.getAllPostByEnt(id_ent).subscribe(data => {
            this.posts = data;
            for(let i = 0; i < this.posts.length; i ++){
                let date = (this.posts[i].date).split(" ");
                let date1 = date[0].split('-');
                let heure = date[1].split(':');
                if(this.posts[i].image != ""){
                  this.actu.push({
                    type: "post",
                    id: this.posts[i].id,
                    id_creator: this.posts[i].id_user,
                    nameAuthor: this.posts[i].prenom+" "+this.posts[i].nom,
                    date: this.posts[i].date,
                    video: this.posts[i].video,
                    video_type: this.posts[i].video_type,
                    titre: "",
                    description: this.linkify(this.strip_tags(this.posts[i].post,'').replace(new RegExp('\n','g'), '<br/>')),
                    image: "https://hautier.teamsmart.fr/images/post/"+this.posts[i].image,
                    avatar: this.posts[i].avatar,
                    jour: Math.round(new Date(date1[0], date1[1]-1, date1[2], heure[0], heure[1], heure[2]).getTime()/1000),
                    nb_like: this.posts[i].nb_likes,
                    id_ent: this.posts[i].id_ent,
                    likes_list: this.posts[i].likes_list
                  });
                }else{
                  this.actu.push({
                    type: "post",
                    id: this.posts[i].id,
                    id_creator: this.posts[i].id_user,
                    nameAuthor: this.posts[i].prenom+" "+this.posts[i].nom,
                    date: this.posts[i].date,
                    titre: "",
                    video: this.posts[i].video,
                    video_type: this.posts[i].video_type,
                    description: this.linkify(this.strip_tags(this.posts[i].post,'').replace(new RegExp('\n','g'), '<br/>')),
                    image: null,
                    avatar: this.posts[i].avatar,
                    jour: Math.round(new Date(date1[0], date1[1]-1, date1[2], heure[0], heure[1], heure[2]).getTime()/1000),
                    nb_like: this.posts[i].nb_likes,
                    id_ent: this.posts[i].id_ent,
                    likes_list: this.posts[i].likes_list
                  });
                }
            }
            this.endPost = true;
        });
    } else if (this.typeActu == "filiale"){
        var dg : any;
        this.annuaire.getEmployeById(this.userContact).subscribe(data => {
            dg = data[0]['id_entreprise'];
            if(dg == '20'){
                this.annuaire.getAllPostFiliale().subscribe(data => {
                    this.posts = data;
                    for(let i = 0; i < this.posts.length; i ++){
                        let date = (this.posts[i].date).split(" ");
                        let date1 = date[0].split('-');
                        let heure = date[1].split(':');
                        if(this.posts[i].image != ""){
                            this.actu.push({
                              type: "post",
                              id: this.posts[i].id,
                              id_creator: this.posts[i].id_user,
                              nameAuthor: this.posts[i].title,
                              date: this.posts[i].date,
                              titre: "",
                              description: this.linkify(this.strip_tags(this.posts[i].post,'').replace(new RegExp('\n','g'), '<br/>')),
                              image: "https://hautier.teamsmart.fr/images/post/"+this.posts[i].image,
                              avatar: this.posts[i].avatar,
                              jour: Math.round(new Date(date1[0], date1[1]-1, date1[2], heure[0], heure[1], heure[2]).getTime()/1000),
                              nb_like: this.posts[i].nb_likes,
                              likes_list: this.posts[i].likes_list,
                              id_ent: this.posts[i].id_ent
                            });
                        }else{
                            this.actu.push({
                              type: "post",
                              id: this.posts[i].id,
                              id_creator: this.posts[i].id_user,
                              nameAuthor: this.posts[i].title,
                              date: this.posts[i].date,
                              titre: "",
                              description: this.linkify(this.strip_tags(this.posts[i].post,'').replace(new RegExp('\n','g'), '<br/>')),
                              image: null,
                              avatar: this.posts[i].avatar,
                              jour: Math.round(new Date(date1[0], date1[1]-1, date1[2], heure[0], heure[1], heure[2]).getTime()/1000),
                              nb_like: this.posts[i].nb_likes,
                              likes_list: this.posts[i].likes_list,
                              id_ent: this.posts[i].id_ent
                            });
                        }
                    }
                    this.endPost = true;
                });
            }else {
                this.annuaire.getFiliale(this.userContact).subscribe(service => {
                    this.annuaire.getAllPostByEnt(service[0]['loc_id']).subscribe(data => {
                        this.posts = data;
                        for(let i = 0; i < this.posts.length; i ++){
                            let date = (this.posts[i].date).split(" ");
                            let date1 = date[0].split('-');
                            let heure = date[1].split(':');
                            if(this.posts[i].image != ""){
                                this.actu.push({
                                  type: "post",
                                  id: this.posts[i].id,
                                  id_creator: this.posts[i].id_user,
                                  nameAuthor: this.posts[i].title,
                                  date: this.posts[i].date,
                                  titre: "",
                                  description: this.linkify(this.strip_tags(this.posts[i].post,'').replace(new RegExp('\n','g'), '<br/>')),
                                  image: "https://hautier.teamsmart.fr/images/post/"+this.posts[i].image,
                                  avatar: this.posts[i].avatar,
                                  jour: Math.round(new Date(date1[0], date1[1]-1, date1[2], heure[0], heure[1], heure[2]).getTime()/1000),
                                  nb_like: this.posts[i].nb_likes,
                                  likes_list: this.posts[i].likes_list,
                                  id_ent: this.posts[i].id_ent
                                });
                            }else{
                                this.actu.push({
                                  type: "post",
                                  id: this.posts[i].id,
                                  id_creator: this.posts[i].id_user,
                                  nameAuthor: this.posts[i].title,
                                  date: this.posts[i].date,
                                  titre: "",
                                  description: this.linkify(this.strip_tags(this.posts[i].post,'').replace(new RegExp('\n','g'), '<br/>')),
                                  image: null,
                                  avatar: this.posts[i].avatar,
                                  jour: Math.round(new Date(date1[0], date1[1]-1, date1[2], heure[0], heure[1], heure[2]).getTime()/1000),
                                  nb_like: this.posts[i].nb_likes,
                                  likes_list: this.posts[i].likes_list,
                                  id_ent: this.posts[i].id_ent
                                });
                            }
                        }
                        this.endPost = true;
                    });
                });
            }
        });
    }

    console.log('ACTUS',this.actu);

    var self = this;
    let load = setInterval(function(){
      if(self.endNew == true && self.endTweet == true && self.endPost == true && self.endTweet2 == true) {
        //Sort actu by date
        self.actu.sort(function(a,b) {return (a.jour > b.jour) ? 1 : ((b.jour > a.jour) ? -1 : 0);} );
        //Reverse to descending order
        self.actu.reverse();
        self.setActu();
        if(self.navParams.get('ancre') != undefined){
          let element = $('#'+self.navParams.get('ancre')).offset().top;
          $(".scroll-content").animate({ scrollTop: element }, 0);
        }
        $('.href-linkify').on('click',function(){
          console.log(this);
          var href = $(this).text();
          console.log(href);
          self.clickLink(href);
        });
        clearInterval(load);
      }
    },50);
  }

    public precisionRound(number, precision) {
      var factor = Math.pow(10, precision);
      return Math.round(number * factor) / factor;
    }

    public setActu(){
      this.date = [];
      var self = this;
      let compteur = 0;
      /*let load = setInterval(function(){
        if($('.description_'+compteur)!=undefined) {
          let compteur2 = compteur;
          //$("#description_"+compteur2).html(self.actu[compteur2].description);
          if(self.actu[compteur2].type == "tweet") {
            $('#img_avatar_'+compteur2).css('background-image', 'url('+self.actu[compteur2].avatar+')');
          }

          if(self.actu[compteur2].type == "tweet"){
            self.newsSrv.getLikeActuUser(self.actu[compteur2].id, self.userContact).subscribe(data =>{
              if(data.length == 0){
                $('#like'+self.actu[compteur2].id).css('color', 'black');
              }else{
                $('#like_'+self.actu[compteur2].id).css('color', 'red');
              }
            });

            self.newsSrv.getLikeActu(self.actu[compteur2].id).subscribe(data =>{
              $('#nb_like_'+self.actu[compteur2].id).text(data.length);
            });

            self.newsSrv.getCommentActu(self.actu[compteur2].id).subscribe(data =>{
              $('#nb_comment_'+self.actu[compteur2].id).text(data.length);
            });
          }
          compteur ++;
        }

        if(compteur == self.actu.length-1)
        {
          clearInterval(load);
        }
      },50);*/

      /*for(let i = 0; i < this.actu.length; i ++){
          //$("#description_"+i).html(this.actu[i].description.replace(new RegExp('\n','g'), '<br/>'));
        if(this.actu[i].type == "new" || this.actu[i].type == "post") {
            if(this.posts[i].is_ent == 1 && this.posts[i].id_ent != 1){
                this.annuaire.getEntreprise1(this.actu[i].id_ent).subscribe(data => {
                    this.place = data[0];
                    if(this.place.image != "") {
                        $('#img_avatar_'+i).css("background-image", "url('https://hautier.teamsmart.fr/images/entreprise/profils/"+this.place.image+"')");
                    }else{
                        $('#img_avatar_'+i+' ion-icon').css('display', 'block');
                    }
                });
            } else {
                this.annuaire.getEntreprise1(this.actu[i].id_ent).subscribe(data => {
                    this.place = data[0];
                    if(this.place.image != "") {
                        $('#img_avatar_'+i).css("background-image", "url('assets/imgs/logo-hautier.png')");
                    }else{
                        $('#img_avatar_'+i+' ion-icon').css('display', 'block');
                    }
                })
            }
          this.newsSrv.getLikeActuUser(this.actu[i].id, this.userContact).subscribe(data =>{
            if(data.length == 0){
              $('#like_'+this.actu[i].id).css('color', 'black');
            }else{
              $('#like_'+this.actu[i].id).css('color', 'red');
            }
          });

          this.newsSrv.getLikeActu(this.actu[i].id).subscribe(data =>{
            $('#nb_like_'+this.actu[i].id).text(data.length);
          });

          this.newsSrv.getCommentActu(this.actu[i].id).subscribe(data =>{
            if(data.length == 0){
              $('#nb_comment_'+this.actu[i].id).text(data.length);
            }else{
              $('#nb_comment_'+this.actu[i].id).text(data.length);
            }
          });
        }
      }*/
      $("#actu_content").css("display", "block");
      $('#load-news, #loader-news').hide();
    }

  public checkIfLike(likes){
    var inspect = false;
    for(var i = 0; i < likes.length; i++){
      if(likes[i].id_user == this.userContact){
        inspect = true;
      }
    }
    if(inspect){
      return 'red';
    }else{
      return '#000';
    }
  }


    public comment(id,type){
      this.navCtrl.setRoot('NewsComment', {
        id_actu: id,
        id_ent: this.id_ent_post,
        id_user: this.userContact,
        id_ent_post: this.id_ent_post,
        ancre: type+'-'+id,
        typeActu: this.typeActu
      });
    }

    public like(id_actu){
      this.newsSrv.getLikeActuUser(id_actu, this.userContact).subscribe(data =>{
        if(data.length == 0){
          let reponseLike = [];
          reponseLike.push({
            id_actu : id_actu,
            is_like : 1,
            id_user: this.userContact
          })
          this.newsSrv.postLikeActu(JSON.stringify(reponseLike)).then(data => {
          });
          $('#like_'+id_actu).css('color', 'red');
          let nb_like = parseInt($('#nb_like_'+id_actu).text(), 10);
          $('#nb_like_'+id_actu).text(nb_like+1);
        }else{
          let reponseLike = [];
          reponseLike.push({
            id_actu : id_actu,
            is_like : 0,
            id_user: this.userContact
          })
          this.newsSrv.postLikeActu(JSON.stringify(reponseLike)).then(data => {
          });
          $('#like_'+id_actu).css('color', 'black');
          let nb_like = parseInt($('#nb_like_'+id_actu).text(), 10);
          $('#nb_like_'+id_actu).text(nb_like-1);
        }
      });
    }

    public goToDetailNews(id, type){
      if(type == "new")
      {
        this.navCtrl.setRoot('news-detail', {
          param: id
        });
      }else if(type == "event"){
        this.navCtrl.setRoot('event-detail', {
          param: id,
          way : 'list',
            prov : "list_events"
        //id : this.navParams.get('param')
      });
      }
    }

    public getImg(){

    }

    //Fonction pour publier un post
    public savePost(){
        let loader = this.loadingCtrl.create({
            content: "Envoi du post ..."
        });
        loader.present();
        this.monPost = this.monPost.replace('\\r\\n', '<br/>');
        if(this.img_post != "" || this.monPost != ""){
            this.lesReponsesPosts = [];
            this.lesReponsesPosts.push({
                id_user : this.userContact,
                post : this.monPost,
                is_ent: 0,
                image: this.img_post,
                date: this.formatDate(new Date()),
                cli: this.ent_selected
            });
            this.annuaire.postMesPost(JSON.stringify(this.lesReponsesPosts)).then(data => {
                let response = data;
                if(response != null){
                    let alert = this.alertCtrl.create({
                        title: 'Oups...',
                        message: "L'envoi de la réponse a connu un problème...",
                        buttons: ['Fermer']
                    });
                    alert.present();
                }else{
                    this.presentToast("Publication enregistrée.");

                }
                this.getUser();
                this.monPost = "";
                this.img_post= "";
                $('#input_post').val('');
                $('.preloadImg').remove();
                loader.dismiss();
            });
        }else{
            this.presentToast("Veuillez remplir le champ avant de faire un post.");
        }
    }

    //Fonction pour convertir une date
    public formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }

    private presentToast(msg){
        let toast = this.toastCtrl.create({
            message: msg,
            duration: 3000,
            position: 'bottom'
        });

        toast.onDidDismiss(() => {
        });

        toast.present();
    }

    public removeImg(){
        $('.img-cross-delete').hide();
        $('.preloadImg').remove();
        this.img_post = "";
    }

    public openProfil(){
        this.navCtrl.setRoot('place-detail',{
            param : this.userContact,
            idCat: 'team'
        })
    }

  public linkify(inputText) {

    var replacedText, replacePattern1, replacePattern2, replacePattern3;

    //URLs starting with http://, https://, or ftp://
    replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    inputText = inputText.replace(replacePattern1, '<span class="href-linkify" data-href="$1">$1</span>');

    //URLs starting with "". (without // before it, or it'd re-link the ones done above).
    replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    inputText = inputText.replace(replacePattern2, '$1<span class="href-linkify" data-href="http://$2" >http://$2</span>');

    //Change email addresses to mailto:: links.
    replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\-_]+?(\.[a-zA-Z]{2,6})+)/gim;
    inputText = inputText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');

    return inputText;
  }

  public clickLink(href){
    if(href != "" && href != null && href != undefined){
      this.appBrowser.create(href,'_system');
    }
  }

  // REMOVE ALL HTMLTAGS FROM STRING
  private strip_tags(str, allow){
    // making sure the allow arg is a string containing only tags in lowercase (<a><b><c>)
    allow = (((allow || '') + '').toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join('');

    var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;
    var commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
    return str.replace(commentsAndPhpTags, '').replace(tags, function ($0, $1) {
      return allow.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 :'';
    });
  }

  public displayFullImg(ac){
    this.transforms = [];
    this.currentScale = 1;
    this.currentDeltaX = 0;
    this.currentDeltaY = 0;
    this.transforms.push('scale(' + this.currentScale + ')');
    this.transforms.push('translate(' + this.currentDeltaX + 'px,' + this.currentDeltaY + 'px)');
    this.container.style.transform = this.transforms.join(' ');
    $('.img_full_size').find('.img_box').find('img').attr('src',ac.image);
    $('.img_full_size').find('.img_post_info').find('.name').text(ac.nameAuthor);
    $('.img_full_size').find('.img_post_info').find('.desc').text(ac.description);
    $('.img_full_size').fadeIn();
  }

  public closeImg(){
    $('.img_full_size').fadeOut();
    $('.img_full_size').find('.img_post_info').find('.name').text('');
    $('.img_full_size').find('.img_post_info').find('.desc').text('');
    $('.img_full_size').find('.img_box').find('img').attr('src','');
    this.transforms = [];
    this.currentScale = 1;
    this.currentDeltaX = 0;
    this.currentDeltaY = 0;
    this.transforms.push('scale(' + this.currentScale + ')');
    this.transforms.push('translate(' + this.currentDeltaX + 'px,' + this.currentDeltaY + 'px)');
    this.container.style.transform = this.transforms.join(' ');
  }

  private saveReadNews(type, user){
    let params: any = [{
      type: type,
      user: user
    }];
    this.newsSrv.saveReadNews(JSON.stringify(params)).then(_ => {});
  }

}
