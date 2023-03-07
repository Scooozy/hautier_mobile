import { Component, ViewChild } from '@angular/core';
import {
    IonicPage,
    NavController,
    AlertController,
    NavParams,
    Slides,
    LoadingController,
    ToastController
} from 'ionic-angular';
import {FormBuilder, FormGroup, FormControl, Validators, ValidatorFn, AbstractControl} from "@angular/forms";
import {HomeServiceProvider} from "../../providers/home-service/home-service";
import * as $ from 'jquery';
import {ContentserviceProvider} from "../../providers/contentservice/contentservice";
import { InAppBrowser } from '@ionic-native/in-app-browser';
import {FileTransfer, FileTransferObject, FileUploadOptions} from "@ionic-native/file-transfer";
import {AnnuaireServiceProvider} from "../../providers/annuaire-service/annuaire-service";
import {Camera} from "@ionic-native/camera";

@IonicPage()
@Component({
  selector: 'page-slide',
  templateUrl: 'slide.html',
})
export class SlidePage {
    img_ent: string = 'avatar.png';
    imageURI: any;

    @ViewChild('slides') slides: Slides;
    private slide1Form : FormGroup;
    private slide2Form : FormGroup;
    private slide3Form : FormGroup;
    private slide4Form : FormGroup;
    private slide5Form : FormGroup;
    private slide6Form : FormGroup;
    private entreprises : any[] = [];
    private selectedEntreprise : any;
    private indexSlide : number;
    private cgu : string;
    private showPassConfirmation: boolean = false;
    private showPass: boolean = false;
    private typeMdp = 'password';
    private typeMdpConfirmation = 'password';
    private img_user: string = 'avatar.png';

    constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder,
                private homeSrv: HomeServiceProvider, private alertCtrl: AlertController,
                private contentSrv: ContentserviceProvider, private iab: InAppBrowser, private annuaire: AnnuaireServiceProvider,
                private loadingCtrl: LoadingController, private toastCtrl: ToastController, private camera: Camera,
                private transfer: FileTransfer) {

        let regTelephone = new RegExp("^((\\+\\d{1,3}(-| )?\\(?\\d\\)?(-| )?\\d{1,3})|(\\(?\\d{2,3}\\)?))(-| )?(\\d{3,4})(-| )?(\\d{4})(( x| ext)\\d{1,5}){0,1}$");
        this.slide1Form = this.formBuilder.group({
            nom: ['', Validators.required],
            prenom: ['', Validators.required],
            identifiant: ['', Validators.required],
            mdp: ['', Validators.required, ],
            mdp_confirmation: ['', Validators.required],
            email: ['', Validators.required],
            telephone: ['', Validators.pattern(regTelephone)],
        },{validator: this.checkIfMatchingPasswords('mdp', 'mdp_confirmation')});
        this.slide2Form = this.formBuilder.group({
            code: ['', Validators.required],
        });
        this.slide3Form = this.formBuilder.group({
            entreprise: ['', Validators.required],
        });
        this.slide4Form = this.formBuilder.group({
            desc: [''],
            competence: [''],
        });
        this.slide5Form = this.formBuilder.group({
            cgu: ['', Validators.required],
        });
        this.slide6Form = this.formBuilder.group({
            nom: ['', Validators.required],
            telephone: ['', Validators.required],
            email: ['', Validators.required],
            bio: ['', Validators.required],
        });

        this.homeSrv.getCGU().subscribe(data =>{
           this.cgu =  data;
        });

    }



    ionViewDidLoad(){
        $("ion-footer").css('visibility','hidden');
        this.slides.lockSwipeToNext(true);
        $(".input-text").focusin(function(){
            $('.footer').hide();
        });
        $(".input-text").focusout(function(){
            $('.footer').show();
        });

        $('.create-user').find('.content_slide').find('ion-item').find('ion-input').focusin(function () {
            $('ion-grid').css('height','300%');
        });
        $('.create-user').find('.content_slide').find('ion-item').find('ion-input').focusout(function () {
            $('ion-grid').css('height','100%');
        });

        $('.create-ent').find('.content_slide').find('ion-item').find('ion-input').focusin(function () {
            $('ion-grid').css('height','300%');
        });
        $('.create-ent').find('.content_slide').find('ion-item').find('ion-input').focusout(function () {
            $('ion-grid').css('height','100%');
        });

        $('.create-ent').find('.content_slide').find('ion-item').find('ion-textarea').focusin(function () {
            $('ion-grid').css('height','300%');
        });
        $('.create-ent').find('.content_slide').find('ion-item').find('ion-textarea').focusout(function () {
            $('ion-grid').css('height','100%');
        });
    }

    inscription(){
        this.slideTo(2);
    }

    public backToCo(){
        this.navCtrl.setRoot('ConnexionPage',{});
    }

    valideCode(i){
        if(this.slide2Form.controls['code'].value.replace(/\s/g, "") != ""){
            this.homeSrv.checkCodeEntreprise(this.slide2Form.controls['code'].value).subscribe(data => {
                console.log(data);
                if(data.length > 0){
                    this.entreprises = data;
                    if(i == 1){
                        this.slideTo(1);
                    }
                } else {
                    let alert = this.alertCtrl.create({
                        title: 'Erreur Code',
                        subTitle: "Désolé, ce code n'existe pas.",
                        buttons: ['OK']
                    });
                    alert.present();
                }

            })
        }
    }

    valideEntreprise(){
        console.log("Valide Entreprise");
        this.slideTo(3);
    }

    creationEntreprise(){
        console.log("Création Entreprise");
        this.slides.lockSwipeToNext(false);
        this.slides.slideTo(5);
        this.slides.lockSwipes(true);
        this.indexSlide = 1;
    }

    ajoutEntreprise(){
        console.log("Ajout Entreprise");
        this.slides.lockSwipeToNext(false);
        this.slides.slideTo(5);
        this.slides.lockSwipes(true);
        this.indexSlide = 2;
    }

    checkCGU(){
        console.log(this.slide4Form.value);
        var params = [];
        params.push({
            name: this.slide1Form.controls['nom'].value,
            f_name: this.slide1Form.controls['prenom'].value,
            username: this.slide1Form.controls['identifiant'].value,
            pwd: this.slide1Form.controls['mdp'].value,
            bio: this.slide4Form.controls['desc'].value.replace('\\r\\n', '<br/>'),
            email: this.slide1Form.controls['email'].value,
            phone: this.slide1Form.controls['telephone'].value,
            company: this.selectedEntreprise,
            image: this.img_user
        });
        console.log('PARAMS');
        console.log(params);
        this.contentSrv.postUser(JSON.stringify(params)).then(data => {
            let response = data;
            if (response == 'NOPE') {
                let alert = this.alertCtrl.create({
                    title: 'Oups...',
                    message: "L'adresse mail est déja utilisée",
                    buttons: ['Fermer']
                });
                alert.present();
                this.slideTo(1);
            } else {
                let alert = this.alertCtrl.create({
                    title: 'Enregistré !',
                    message: "Bienvenue dans Teamsmart ! Vous pouvez maintenant vous connecter et continuer l'expérience !",
                    buttons: ['Continuer']
                });
                alert.present();
                this.navCtrl.setRoot('ConnexionPage', {});
            }
        });
        this.slideTo(4)
    }

    checkProfil(){
        console.log(this.slide4Form.value);
        this.slideTo(4);
    }

    onChange(value){
        console.log(value);
        this.selectedEntreprise = value;
    }

    checkCreationEntreprise(){
        var params = [];
        params.push({
            name: this.slide6Form.controls['nom'].value,
            bio: this.slide6Form.controls['bio'].value.replace('\\r\\n', '<br/>'),
            email: this.slide6Form.controls['email'].value,
            phone: this.slide6Form.controls['telephone'].value,
            image: this.img_ent,
            niveau1: this.entreprises[0].n1
        });
        this.contentSrv.postCompany(JSON.stringify(params)).then(data =>{
            let response = data;
            if(response != null){
                let alert = this.alertCtrl.create({
                    title: 'Oups...',
                    message: "L'envoi du formualire a rencontré un problème...",
                    buttons: ['Fermer']
                });
                alert.present();
            }else{
                let alert = this.alertCtrl.create({
                    title: 'Enregistré !',
                    message: "Votre entreprise a été enregistrée! Vous pouvez maintenant vous y inscrire.",
                    buttons: ['Continuer']
                });
                alert.present();
                this.valideCode(0);
                this.slides.lockSwipes(false);
                this.slides.slideTo(this.indexSlide);
                this.slides.lockSwipeToNext(true);
            }
        });

    }

    slideTo(index){
        this.slides.lockSwipeToNext(false);
        this.slides.slideTo(index);
        this.slides.lockSwipeToNext(true);
    }

    checkIfMatchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
        return (group: FormGroup) => {
            let passwordInput = group.controls[passwordKey],
                passwordConfirmationInput = group.controls[passwordConfirmationKey];
            if (passwordInput.value !== passwordConfirmationInput.value) {
                return passwordConfirmationInput.setErrors({notEquivalent: true})
            }
            else {
                return passwordConfirmationInput.setErrors(null);
            }
        }
    }
    //Permet de cacher et montre le mot de passe
    public showPassword() {
        this.showPass = !this.showPass;
        if(this.showPass){
            this.typeMdp = 'text';
        } else {
            this.typeMdp = 'password';
        }
    }

    //Permet de cacher et montre le mot de passe
    public showPasswordConfirmation() {
        this.showPassConfirmation = !this.showPassConfirmation;
        if(this.showPassConfirmation){
            this.typeMdpConfirmation = 'text';
        } else {
            this.typeMdpConfirmation = 'password';
        }
    }

    public lienAdhesion(){
        this.iab.create('https://hautier.teamsmart.fr/adhesion', '_system', 'location=yes');
    }

    public getImg(type){
        this.displayImgChoice(type);
    }

    private getCameraImg(type){
        let cameraOptions = {
            quality: 50,
            destinationType: this.camera.DestinationType.FILE_URI,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            correctOrientation: true
        };
        this.camera.getPicture(cameraOptions).then((imageData) => {
            this.imageURI = imageData;
            this.uploadFile(type);
        }, (err) => {
        });
    }

    //fonction pour recupérer une image du téléphone
    public getLibraryImg(type) {
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
            this.uploadFile(type);
        }, (err) => {
            console.log(err);
        });
    }

    //Fonction pour mettre la photo sur le serveur
    private uploadFile(type) {
        $('.preloadImg').remove();
        let loader = this.loadingCtrl.create({
            content: "Chargement de la photo ..."
        });
        loader.present();
        if(type == 'user'){
            this.img_user= "";
            const fileTransfer: FileTransferObject = this.transfer.create();
            let id_img = this.makeid();
            let name_file = id_img+".jpg";

            let options: FileUploadOptions = {
                chunkedMode: false,
                fileKey: 'file',
                fileName: name_file,
                params:{operatiune:'uploadpoza'}
            };

            console.log('OPTION');
            console.log(options);
            fileTransfer.upload(this.imageURI, 'https://hautier.teamsmart.fr/images/entreprise/profils/upload.php', options).then((data) => {
                this.img_user = name_file;
                loader.dismiss();
                this.presentToast("La photo a été enregistré avec succès");
            }, (err) => {
                loader.dismiss();
                this.presentToast("La photo n'a pas pu être enregistrée");
            });
        } else {
            this.img_ent= "";
            const fileTransfer: FileTransferObject = this.transfer.create();
            let id_img = this.makeid();
            let name_file = id_img+".jpg";

            let options: FileUploadOptions = {
                chunkedMode: false,
                fileKey: 'file',
                fileName: name_file,
                params:{operatiune:'uploadpoza'}
            };
            fileTransfer.upload(this.imageURI, 'https://hautier.teamsmart.fr/images/jevents/jevlocations/upload.php', options).then((data) => {
                this.img_ent = name_file;
                loader.dismiss();
                this.presentToast("La photo a été enregistré avec succès");
            }, (err) => {
                loader.dismiss();
                this.presentToast("La photo n'a pas pu être enregistrée");
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

    private  presentToast(msg) {
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

    private displayImgChoice(type){
        let alert = this.alertCtrl.create({
            title: "Photo de profil",
            message: 'Quel outil voulez-vous ouvrir ?',
            buttons: [{
                text: 'Appareil Photo',
                handler: () => {
                    this.getCameraImg(type);
                }
            },{
                text: 'Mes images',
                handler: () => {
                    this.getLibraryImg(type);
                }
            }]
        });
        alert.present();
    }

}
