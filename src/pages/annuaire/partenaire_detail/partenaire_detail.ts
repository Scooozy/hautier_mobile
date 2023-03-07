import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Select, AlertController, ToastController, LoadingController, IonicPage } from 'ionic-angular';
import { Nav } from 'ionic-angular';
import { AnnuaireServiceProvider } from '../../../providers/annuaire-service/annuaire-service';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import * as $ from 'jquery';
import {Camera} from "@ionic-native/camera";
import {FileTransfer, FileTransferObject, FileUploadOptions} from "@ionic-native/file-transfer";

@IonicPage()
@Component({
    selector: 'page-partenairedetail',
    templateUrl: 'partenaire_detail.html'
})

export class PartenairedetailPage {
    @ViewChild(Nav) nav: NavController;
    @ViewChild(Select) select: Select;
    @ViewChild('SelectFav') monSelectFav: Select;

    mesOffres: any;
    mesOffresLength: any;
    id_user: number;
    ent_selected: number;
    id_partenaire: number = 0;
    title : string = "";
    image: string = "";
    description: string = "";
    descriptionLength: number = 0;
    text: string = "";
    mesPostsLength: number = 0;
    mesPosts: any = [];
    offresLenght: number = 0;
    offrs: any = [];
    tel: string = "";
    mail: string = "";
    isadmin: boolean = false; // si je suis admin
    ifadmin: boolean = false; // s'il y a un admin
    imageURI: string = "";
    img_post: string;
    monPost: string = "";
    type_message: string;
    monOffre: string;

    constructor(public navCtrl: NavController, public navParams: NavParams, private Sqlite: SQLite,public loadingCtrl:LoadingController,
                private annuaire: AnnuaireServiceProvider, private camera: Camera,private transfer: FileTransfer,
                public toastCtrl:ToastController, private alertCtrl:AlertController) {

        this.id_partenaire = this.navParams.get('param');
        this.title = this.navParams.get('title');
        this.image = this.navParams.get('image');
        this.type_message = 'offre';
        this.getUser();
    }

    ionViewDidLoad(){
        this.displayTraitOffres();
    }

    private displayTraitOffres(){
        $('.trait_offres').css("width",$(".sous-titre").width()-$('.titre_offres').width()-10+"px");
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

    //Get le user connecté
    public getUser(){
        this.Sqlite.create({
            name: 'ionicdb.db',
            location: 'default'
        }).then((db: SQLiteObject) => {
            db.executeSql('SELECT * FROM connectContact', {})
                .then(res => {
                    this.id_user = res.rows.item(0).id_user;
                    this.Sqlite.create({
                        name: 'ionicdb.db',
                        location: 'default'
                    }).then((db: SQLiteObject) => {
                        db.executeSql('SELECT * FROM ent_selected', {})
                            .then(result => {
                                if (result.rows.length != 0) {
                                    this.ent_selected = result.rows.item(0).id_ent;
                                    this.getPartenaire();
                                    this.getAdminEnt();
                                    this.getPost(this.id_partenaire);
                                    this.getOffre(this.id_partenaire);
                                }
                            });
                    });
                    /************************/
                    /***** A DEPLACER *****/
                    /************************/
                    $('#load, #loader').hide();
                });
        });
    }

    private getPartenaire(){
        this.annuaire.getEntreprise1(this.id_partenaire).subscribe(data => {
            this.description = data[0].description;
            this.descriptionLength = this.description.length;
            this.mail = data[0].email;
            this.tel = data[0].phone;

            var self = this;
            var load = setInterval(function(){
                if($('#text_bio').length != 0) {
                    self.text = $('#text_bio').text();
                    if($('#text_bio').text().length >250){
                        $('#text_bio').text(self.text.substring(0, 250) + '...');
                        $('#arrow_down').css('display','block');
                    }
                    clearInterval(load);
                }
            },50);

        });
    }

    private getAdminEnt(){
        this.annuaire.getAdminEnt(this.id_partenaire).subscribe(data =>{
            for(var i = 0; i < data.length; i++){
                this.ifadmin = true;
                if(data[i].id_user == this.id_user){
                    this.isadmin = true;
                }
            }
        });
    }

    //Function pour get les posts de l'ent
    private getPost(id_ent){
        this.annuaire.getAllPostEnt(id_ent,this.ent_selected).subscribe(data =>{
            this.mesPosts = data;
            this.mesPostsLength = this.mesPosts.length;
            this.mesPosts.sort(function(a,b) {return (a.date > b.date) ? 1 : ((b.date > a.date) ? -1 : 0);} );
            //Reverse to descending order
            this.mesPosts.reverse();

            var load = setInterval(function(){
                if($('.imgPost') != undefined && $('.imgPost').length > 0) {
                    for(let i = 0; i<data.length;i++){
                        if(data[i].image != ""){
                            $('.imgPost_'+data[i].id).attr("src", "https://hautier.teamsmart.fr/images/post/"+data[i].image);
                            $('.imgPost_'+data[i].id).css('display','block');
                        }else{
                            $('.imgPost_'+data[i].id).css('display','none');
                        }
                    }
                    clearInterval(load);
                }
            },50);
        });
    }

    //Function pour get les posts de l'ent
    private getOffre(id_ent){
        this.annuaire.getAllPostPartenaireEnt(id_ent,this.ent_selected).subscribe(data =>{
            console.log("OFFRES");
            console.log(data);
            this.mesOffres = data;
            for (let i = 0; i < this.mesOffres.length; i++) {
                this.mesOffres[i]['post'] = this.mesOffres[i]['post'].replace(new RegExp('\n','g'), '<br/>');
            }
            this.mesOffresLength = this.mesOffres.length;
            this.mesOffres.sort(function(a,b) {return (a.date > b.date) ? 1 : ((b.date > a.date) ? -1 : 0);} );
            //Reverse to descending order
            this.mesOffres.reverse();

            var self = this;
            var load = setInterval(function(){
                if($('.imgPost') != undefined && $('.imgPost').length > 0) {
                    self.displayTraitOffres();
                    for(let i = 0; i<data.length;i++){
                        if(data[i].image != ""){
                            $('.imgPost_'+data[i].id).attr("src", "https://hautier.teamsmart.fr/images/post/"+data[i].image);
                            $('.imgPost_'+data[i].id).css('display','block');
                        }else{
                            $('.imgPost_'+data[i].id).css('display','none');
                        }
                    }
                    clearInterval(load);
                }
            },50);
        });
    }

    //Funtion pour voir plus ou moins su texte de description
    public showMore(){
        if($('#text_bio').text().length > 253){
            $('#text_bio').html(this.text.substring(0, 250) + '...');
            $('#arrow_down').css('display','block');
            $('#arrow_up').css('display','none');
        }else{
            $('#text_bio').text(this.text);
            $('#arrow_down').css('display','none');
            $('#arrow_up').css('display','block');
        }
    }

    //Function change between bio and post
    private change(param) {
        $('.filter').removeClass('active_tab');
        if (param == 0) {
            this.type_message = 'offre';
            $('#contentEnt').show();
            $('#contentActu').hide();
            $('.preloadImg').remove();
            $('#filter_bio').addClass('active_tab');
        } else {
            this.type_message = 'post';
            $('#contentActu').show();
            $('#contentEnt').hide();
            $('.preloadImg').remove();
            $('#filter_post').addClass('active_tab');
        }
    }

    //Fonction pour recup une image pour les post
    getImg(){
        let cameraOptions = {
            quality: 50,
            destinationType: this.camera.DestinationType.FILE_URI,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
            correctOrientation: true
        };
        this.camera.getPicture(cameraOptions).then((imageData) => {
            this.imageURI = imageData;
            this.uploadFile('post');
        }, (err) => {
            console.log(err);
        });
    }

    //Fonction pour mettre la photo sur le serveur
    uploadFile(type) {
        this.img_post= "";
        $('.preloadImg').remove();
        let loader = this.loadingCtrl.create({
            content: "Chargement de la photo ..."
        });
        loader.present();
        const fileTransfer: FileTransferObject = this.transfer.create();
        let id_img = this.makeid();
        let name_file = id_img+".jpg";
        this.img_post = name_file;

        let options: FileUploadOptions = {
            chunkedMode: false,
            fileKey: 'file',
            fileName: name_file,
            params:{operatiune:'uploadpoza'}
        };

        if(type == 'profil'){
            fileTransfer.upload(this.imageURI, 'https://hautier.teamsmart.fr/images/jevents/jevlocations/sad.php', options)
                .then((data) => {
                    let responseImg = [];
                    responseImg.push({
                        ent_id : this.navParams.get('param'),
                        image : name_file,
                    });

                    this.annuaire.postImageProfilEnt(JSON.stringify(responseImg)).then(data => {
                        loader.dismiss();
                        this.presentToast("La photo a été enregistré avec succès");
                    }, (err)=>{
                        loader.dismiss();
                        this.presentToast("La photo n'a pas pu être enregistré");
                    });
                }, (err) => {
                    loader.dismiss();
                    this.presentToast("La photo n'a pas pu être enregistré");
                });
        }else if(type == 'post'){
            fileTransfer.upload(this.imageURI, 'https://hautier.teamsmart.fr/images/post/upload.php', options)
                .then((data) => {
                    $('#input_post').append("<img class='preloadImg' src='https://hautier.teamsmart.fr/images/post/"+name_file+"'/>");
                    loader.dismiss();

                }, (err) => {
                    loader.dismiss();
                    this.presentToast("La photo n'a pas pu être enregistré");
                });
        }
    }

    //Function chaine string aléatoire pour identifiant image
    private makeid() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 20; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    private presentToast(msg) {
        let toast = this.toastCtrl.create({
            message: msg,
            duration: 3000,
            position: 'bottom'
        });

        toast.onDidDismiss(() => {
            console.log('Dismissed toast');
        });

        toast.present();
    }

    //Function pour mettre une offre
    public saveOffre(){
        let lesReponsesOffres = [];
        if(this.img_post != "" || this.monOffre != ""){
            let loader = this.loadingCtrl.create({
                content: "Enregistrement d'une offre ..."
            });
            loader.present();
            console.log(this.monOffre);
            this.monOffre = this.monOffre.replace('\\r\\n', '<br/>');
            lesReponsesOffres.push({
                id_user : 0,
                post : this.monOffre,
                is_ent: 1,
                id_ent: this.id_partenaire,
                image: this.img_post,
                date: this.formatDate(new Date()),
                cli: this.ent_selected
            });
            this.annuaire.postMesOffres(JSON.stringify(lesReponsesOffres)).then(data => {
                let response = data;
                if(response != null){
                    let alert = this.alertCtrl.create({
                        title: 'Oups...',
                        message: "L'envoi de la réponse a connu un problème...",
                        buttons: ['Fermer']
                    });
                    alert.present();
                }
                this.getOffre(this.navParams.get('param'));
                this.monOffre = "";
                this.img_post= "";
                $('#input_offre').val('');
                $('.preloadImg').remove();
                loader.dismiss();
            }).catch( err => {
                loader.dismiss();
                this.saveOffre();
            });
        }else{
            this.presentToast("Veuillez remplir le champ ci-dessus avant de faire une Offre.");
        }
    }

    //Function pour mettre un post
    public savePost(){
        let lesReponsesPosts = [];
        if(this.img_post != "" || this.monPost != ""){
            let loader = this.loadingCtrl.create({
                content: "Enregistrement d'une offre ..."
            });
            loader.present();
            console.log(this.monPost);
            this.monPost = this.monPost.replace('\\r\\n', '<br/>');
            lesReponsesPosts.push({
                id_user : 0,
                post : this.monPost,
                is_ent: 1,
                id_ent: this.id_partenaire,
                image: this.img_post,
                date: this.formatDate(new Date()),
                cli: this.ent_selected
            });
            this.annuaire.postMesPost(JSON.stringify(lesReponsesPosts)).then(data => {
                let response = data;
                if(response != null){
                    let alert = this.alertCtrl.create({
                        title: 'Oups...',
                        message: "L'envoi de la réponse a connu un problème...",
                        buttons: ['Fermer']
                    });
                    alert.present();
                }
                this.getPost(this.navParams.get('param'));
                this.monPost = "";
                this.img_post= "";
                $('#input_post').val('');
                $('.preloadImg').remove();
                loader.dismiss();
            }).catch( err => {
                loader.dismiss();
                this.saveOffre();
            });
        }else{
            this.presentToast("Veuillez remplir le champ ci-dessus avant de faire un post.");
        }
    }

    //Convert Date to readable date
    public dateForPost(dateString) {
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

    //Convetie une date
    public formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }

    public openImg(img){
        $('.img-bg-post').css("background-image","url('https://hautier.teamsmart.fr/images/post/"+img+"')");
        $('.img-bg-post').show();
    }

    public closeImg(){
        $('.img-bg-post').hide();
    }

    //Retour sur la home
    public goBack() {
        if(this.navParams.get('origin') == "home"){
            this.navCtrl.setRoot('home-home');
        } else {
            this.navCtrl.setRoot('PartenairePage');
        }
    }

    public newMsg(){
        //alert('En développement');
    }

    public rdvEnt(){
        //alert('En développement');
    }

    public goToModifEnt(){
        this.navCtrl.setRoot('AdminPage',{
            id: this.navParams.get('param'),
            prov: 'detailPart',
            part: "0"
        });
    }

}
