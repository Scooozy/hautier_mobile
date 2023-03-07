import { Component, ViewChild } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';
import { Nav } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import * as $ from 'jquery';
import { AlertController } from 'ionic-angular';
import { ContactServiceProvider } from "../../../providers/contact-service/contact-service";
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { HttpClient } from "@angular/common/http";

@IonicPage({
  name : 'contact-home',
  segment : 'contact-home'
})
@Component({
  selector: 'page-home-contact',
  templateUrl: 'home.html'
})

export class HomeContactPage {
  @ViewChild(Nav) nav: NavController;
  userContact: number;
  user: any;
  name: string;
  prenoms: string;
  fileURL: any;
  response: any;

  constructor(public navCtrl: NavController, public Sqlite: SQLite, public contactSrv: ContactServiceProvider,
              private camera: Camera, private alertCtrl: AlertController, private transfer: FileTransfer,
              public http: HttpClient) {
    this.getConnected();
  }

  public getConnected(){
    this.Sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('SELECT * FROM connectContact', {})
        .then(res => {
          if (res.rows.length != 0){
            if(res.rows.item(0).connected == 0) {
              this.navCtrl.setRoot('ConnectContactPage', {});
            }else{
              this.userContact = res.rows.item(0).id_user;
              this.getInfoUser(this.userContact);
            }
          }else{
            this.navCtrl.setRoot('ConnectContactPage', {});
          }
        });
    });
  }

  public getInfoUser(user){
    this.contactSrv.getInfoUser(user).subscribe(data => {
      this.user = data;
      this.user = this.user[0];
      this.name = this.user.name;
      this.prenoms = this.user.prenoms;
      $('#load').css('display','none');
      $('#loader').css('display','none');
      if(this.user.image != ""){
        $('#open-gallery-btn').css('display','none');
        $('#img-profil-contact').css('display','block');
        var url = "https://www.villedoux.fr/administrator/components/com_citycontact/views/img/imgProfil/";
        $('#img-profil-contact').attr("src",url+""+this.user.image);
      }
    });
  }

  public openPics(){
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      correctOrientation: true
    };

    this.camera.getPicture(options).then((imageData) => {
      this.showConfirm(imageData);
    }, (err) => {
      // Handle error
    });
  }

  private showConfirm(result) {
    let alert = this.alertCtrl.create({
      title: 'Ajouter la photo',
      message: 'Êtes-vous sûre de vouloir enregistrer cette image en tant que photo de profil ?',
      buttons: [{
        text: 'Annuler',
        role: 'cancel'
      },{
        text: 'Enregistrer',
        handler: () => {
          $('#open-gallery-btn').css('display','none');
          $('#img-profil-contact').css('display','block');
          //var image = document.getElementById('img-profil-contact');
          $('#img-profil-contact').attr('src', result);
          this.fileURL = result;
          this.fileURL = this.fileURL.split("?");
          this.fileURL = this.fileURL[0];
          this.sendPic();
        }
      }]
    });
    alert.present();
  }

  public sendPic() {
    let url = "https://dev.cityapps.fr/administrator/components/com_citycontact/views/img/imgProfil/upload.php";

    const fileTransfer: FileTransferObject = this.transfer.create();

    var nomFichier = this.fileURL.split("/");
    let options1: FileUploadOptions = {
      fileKey: 'file',
      fileName: nomFichier[nomFichier.length-1],
      chunkedMode: false,
      params:{operatiune:'uploadpoza'}
    };

    fileTransfer.upload(this.fileURL, url, options1)
      .then(data => {
        // success
        this.sendDatas();
      }, (err) => {
        // error
        let alert = this.alertCtrl.create({
          title: 'Oups...',
          message: "L'upload de l'image a rencontré un problème.",
          buttons: ['Fermer']
        });
        alert.present();
        $('#load, #loader').hide();
      });

  };

  private sendDatas(){
    var params = [];
    var img = this.fileURL.split('/');
    params.push({
      image : img[img.length-1],
      user_id : this.userContact
    });
    this.contactSrv.postProfilImage(JSON.stringify(params)).then( response => {
      this.response = response;
    });
  }

  public goTo(i){
    switch (i){
      case 0:
        this.navCtrl.setRoot('DemandesContactPage',{});
        break;
      case 1:
        this.navCtrl.setRoot('SondageContactPage',{});
        break;
      case 2:
        this.navCtrl.setRoot('SuggestionsContactPage',{});
        break;
      case 3:
        this.navCtrl.setRoot('SignalementsContactPage',{});
        break;
    }
  }

}
