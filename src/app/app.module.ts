import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpClientModule } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
registerLocaleData(localeFr, 'fr');

import { MyApp } from './app.component';
import { HttpModule } from '@angular/http';
import { Calendar } from '@ionic-native/calendar';
import { LongPressModule } from 'ionic-long-press';


//Plugins
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SQLite } from '@ionic-native/sqlite';
import { Toast } from '@ionic-native/toast';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Vibration } from '@ionic-native/vibration';
import { IonicStorageModule } from '@ionic/storage';
import { Camera } from '@ionic-native/camera';
import { Geolocation } from '@ionic-native/geolocation';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Keyboard } from '@ionic-native/keyboard';
import { CalendarModule } from "ion2-calendar";
import { TwitterService } from 'ng2-twitter';
import { EmailComposer } from '@ionic-native/email-composer';
import { ImagePicker } from '@ionic-native/image-picker';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { FCM } from '@ionic-native/fcm';
import { Push } from '@ionic-native/push';
import { NativeGeocoder } from "@ionic-native/native-geocoder";
import { Market } from "@ionic-native/market";
import { AndroidPermissions } from "@ionic-native/android-permissions";
import { StreamingMedia } from '@ionic-native/streaming-media';


// Providers
import { AnnuaireServiceProvider } from '../providers/annuaire-service/annuaire-service';
import { EventsServiceProvider } from '../providers/events-service/events-service';
import { SqliteServiceProvider } from '../providers/sqlite-service/sqlite-service';
import { ContentserviceProvider } from '../providers/contentservice/contentservice';
import { FavorisServiceProvider } from '../providers/favoris-service/favoris-service';
import { ContactServiceProvider } from '../providers/contact-service/contact-service';
import { NewsServiceProvider } from '../providers/news-services/news-services';
import { FacebookService } from '../providers/facebook-service/facebook-service';
import { MeteoServiceProvider } from '../providers/meteo-service/meteo-service';
import { HomeServiceProvider } from '../providers/home-service/home-service';
import { FileOpener } from '@ionic-native/file-opener';

import { AlertController } from 'ionic-angular';
import { HTTP } from '@ionic-native/http';
import {VideoPlayer} from "@ionic-native/video-player";
import { YoutubeVideoPlayer } from "@ionic-native/youtube-video-player";
import {AppVersion} from "@ionic-native/app-version";


@NgModule({
  declarations: [
    MyApp

  ],
  imports: [
    BrowserModule,
      IonicModule.forRoot(MyApp, {
        platforms: {
          ios: {
            scrollAssist: true,
            autoFocusAssist: true
          }
        }
      }),
    HttpModule,
    HttpClientModule,
    LongPressModule,
    IonicStorageModule.forRoot(),
    CalendarModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AndroidPermissions,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AnnuaireServiceProvider,
    EventsServiceProvider,
    SQLite,
    Toast,
    InAppBrowser,
    SqliteServiceProvider,
    ContentserviceProvider,
    AlertController,
    Calendar,
    HTTP,
    Vibration,
    FavorisServiceProvider,
    ContactServiceProvider,
    Camera,
    Geolocation,
    FileTransfer,
    FileTransferObject,
    File,
    NewsServiceProvider,
    FacebookService,
    TwitterService,
    MeteoServiceProvider,
    EmailComposer,
    ImagePicker,
    LocalNotifications,
    Push,
    AppVersion,
    HomeServiceProvider,
      Keyboard,
      FCM,
      NativeGeocoder,
      Market,
      VideoPlayer,
      StreamingMedia,
      YoutubeVideoPlayer,
      FileOpener
  ]
})
export class AppModule {}
