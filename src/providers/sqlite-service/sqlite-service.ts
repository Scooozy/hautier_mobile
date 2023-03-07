import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

/*
  Generated class for the SqliteServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
  */
  @Injectable()
  export class SqliteServiceProvider {
    constructor(private sqlite: SQLite) {
      console.log('Hello SqliteServiceProvider Provider');
    }

    public createTable(){
      this.sqlite.create({
        name: 'ionicdb.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('CREATE TABLE IF NOT EXISTS home_diamond (' +
          'id integer primary key autoincrement, ' +
          'id_tuile integer, ' +
          'id_list_fav integer, ' +
          'ent_diamond integer, ' +
          'icon text, ' +
          'title text, ' +
          'id_box text, ' +
          'id_line text, ' +
          'id_bdd text, ' +
          'on_click text, ' +
          'diamond_class text, ' +
          'on_drag text, ' +
          'on_drop text, ' +
          'user_id text, ' +
          'on_drag_success text, ' +
          'on_drop_success text)', {})
        .then(res => console.log('Executed SQL'))
        .catch(e => console.log(e));

        db.executeSql('CREATE TABLE IF NOT EXISTS connectContact (' +
          'id integer primary key autoincrement, ' +
          'connected boolean, ' +
          'id_user text, ' +
          'admin boolean)', {})
          .then(res => console.log('Executed SQL'))
          .catch(e => console.log(e));

        db.executeSql('CREATE TABLE IF NOT EXISTS team_diamond (' +
          'id integer primary key autoincrement, ' +
          'icon text, ' +
          'title text, ' +
          'id_box text, ' +
          'id_line text, ' +
          'id_bdd text, ' +
          'on_click text, ' +
          'diamond_class text)', {})
        .then(res => console.log('Executed SQL'))
        .catch(e => console.log(e));

        db.executeSql('CREATE TABLE IF NOT EXISTS favoris (' +
          'id integer primary key autoincrement, ' +
          'icon text, ' +
          'title text, ' +
          'address text, ' +
          'id_bdd text)', {})
        .then(res => console.log('Executed SQL'))
        .catch(e => console.log(e));

        db.executeSql('CREATE TABLE IF NOT EXISTS meteo (' +
          'id integer primary key autoincrement, ' +
          'id_ville text, ' +
          'time text, ' +
          'icon text, ' +
          'summary text, ' +
          'precipProbability text, ' +
          'temperature text, ' +
          'apparentTemperature text, ' +
          'humidity text, ' +
          'windSpeed text)', {})
        .then(res => console.log('Executed SQL'))
        .catch(e => console.log(e));

        db.executeSql('CREATE TABLE IF NOT EXISTS agenda (' +
          'id integer primary key autoincrement, ' +
          'name text, ' +
          'categorie text, ' +
          'free text, ' +
          'child text, ' +
          'pmr text, ' +
          'catname text)', {})
        .then(res => console.log('Executed SQL'))
        .catch(e => console.log(e));

        db.executeSql('CREATE TABLE IF NOT EXISTS connect (' +
          'id integer primary key autoincrement, ' +
          'connected boolean, ' +
          'id_parent text)', {})
        .then(res => console.log('Executed SQL'))
        .catch(e => console.log(e));

        db.executeSql('CREATE TABLE IF NOT EXISTS notifNews (' +
          'id integer primary key, ' +
          'id_news text)', {})
        .then(res => console.log('Executed SQL'))
        .catch(e => console.log(e));

        db.executeSql('CREATE TABLE IF NOT EXISTS alertes (' +
          'id integer primary key autoincrement, ' +
          'id_alert text)', {})
        .then(res => console.log('Executed SQL'))
        .catch(e => console.log(e));

        db.executeSql('CREATE TABLE IF NOT EXISTS ent_selected (' +
          'id integer primary key autoincrement, ' +
          'id_ent integer)', {})
          .then(res => console.log('Executed SQL ent_selected'))
          .catch(e => console.log(e));

        db.executeSql('CREATE TABLE IF NOT EXISTS didactitiel (' +
            'id integer primary key autoincrement, ' +
            'vu boolean)', {})
            .then(res => console.log('Executed SQL didactitiel'))
            .catch(e => console.log(e));
        return true;
      });
    };

    public saveDiamond(id_tuile,id_list_fav, link, icon, title, idBox, id_line, id_bdd, on_click, color, on_drag, on_drop, on_drag_success, on_drop_success,ent_select, user_id){
      console.log("USER_ID");
      console.log(user_id);
      this.sqlite.create({
        name: 'ionicdb.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('INSERT INTO home_diamond (id_tuile, id_list_fav, icon, title, id_box, id_line, id_bdd, on_click, diamond_class, on_drag, on_drop, on_drag_success, on_drop_success, ent_diamond, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [id_tuile, id_list_fav, icon, title, idBox, id_line, id_bdd, on_click, color, on_drag, on_drop, on_drag_success, on_drop_success,ent_select,user_id])
        .then(res => {
          console.log(res);
        });
      });
    };

    public saveDiamondTeam(link, icon, title, idBox, id_line, id_bdd, on_click, color){
      this.sqlite.create({
        name: 'ionicdb.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('INSERT INTO home_diamond (icon, title, id_box, id_line, id_bdd, on_click, diamond_class) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [icon, title, idBox, id_line, id_bdd, on_click, color])
        .then(res => {
          console.log(res);
        });
      });
    };

    public saveDiamond1(i, ii, id_tuile, id_list_fav, icon, title, idBox, id_line, id_bdd, on_click, color, on_drag, on_drop, on_drag_success, on_drop_success,ent_select,user_id){
      this.sqlite.create({
        name: 'ionicdb.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        if(title != '' || (on_click != "" && on_click != "addPage")) {
          db.executeSql('INSERT INTO home_diamond (id_tuile, id_list_fav, icon, title, id_box, id_line, id_bdd, on_click, diamond_class, on_drag, on_drop, on_drag_success, on_drop_success, ent_diamond, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [id_tuile, id_list_fav, icon, title, idBox, id_line, id_bdd, on_click, color, on_drag, on_drop, on_drag_success, on_drop_success, ent_select, user_id])
            .then(res => {
              console.log(res);
            });
        }
      });
    };

    public saveFav(icon, title, id_bdd, address){
      this.sqlite.create({
        name: 'ionicdb.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('INSERT INTO favoris (icon, title, id_bdd, address) VALUES (?, ?, ?, ?)',
          [icon, title, id_bdd, address])
        .then(res => {
          console.log(res);
        });
      });
    };

    public deleteFav(id){
      this.sqlite.create({
        name: 'ionicdb.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('DELETE FROM favoris where id_bdd=?',
          [id])
        .then(res => {
          console.log(res);
        });
      });
    };

    public saveAgenda(nom, cat, free, child, pmr, catname){
      this.sqlite.create({
        name: 'ionicdb.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('INSERT INTO agenda (name, categorie, free, child, pmr, catname) VALUES (?, ?, ?, ?, ?, ?)',
          [nom, cat, free, child, pmr, catname])
        .then(res => {
          console.log(res);
        });
      });
    };

    public updateNews(id, id_news){
      this.sqlite.create({
        name: 'ionicdb.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('UPDATE notifNews SET id_news=? WHERE id=?',
          [id_news, id])
        .then(res => {
          console.log(res);
        });
      });
    };

    public updateDidactitiel(){
        this.sqlite.create({
            name: 'ionicdb.db',
            location: 'default'
        }).then((db: SQLiteObject) => {
            db.executeSql('UPDATE didactitiel SET vu=1',[])
                .then(res => {
                    console.log(res);
                });
        });
    };

      public insertDidactitiel(){
          this.sqlite.create({
              name: 'ionicdb.db',
              location: 'default'
          }).then((db: SQLiteObject) => {
              db.executeSql('INSERT INTO didactitiel (vu) VALUES (1)',
                  [])
                  .then(res => {
                      console.log(res);
                  });
          });
      };

    public saveNews(id, id_news){
      this.sqlite.create({
        name: 'ionicdb.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('INSERT INTO notifNews (id, id_news) VALUES (?, ?)',
          [id, id_news])
        .then(res => {
          console.log(res);
        });
      });
    };

    public deleteMeteo(id){
      this.sqlite.create({
        name: 'ionicdb.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('DELETE FROM meteo where id_ville=?',
          [id])
        .then(res => {
          console.log(res);
        });
      });
    };

    public saveMeteo(id_ville, icon, summary, precipProbability, temperature, apparentTemperature, humidity, windSpeed, time){
      this.sqlite.create({
        name: 'ionicdb.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('INSERT INTO meteo (id_ville, icon, summary, precipProbability, temperature, apparentTemperature, humidity, windSpeed, time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [id_ville, icon, summary, precipProbability, temperature, apparentTemperature, humidity, windSpeed, time])
        .then(res => {
          console.log(res);
        });
      });
    };

    public saveAlert(id){
      this.sqlite.create({
        name: 'ionicdb.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('INSERT INTO alertes (id_alert) VALUES (?)',
          [id])
        .then(res => {
          console.log(res);
        });
      });
    };

    public saveConnect(connected, parent){
      var self = this;
      this.sqlite.create({
        name: 'ionicdb.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('INSERT INTO connect (connected, id_parent) VALUES (?, ?)',
          [connected, parent])
        .then(res => {
          // empty
        });
      });
    };

    public disconnectPF(){
      this.sqlite.create({
        name: 'ionicdb.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('DELETE FROM connect',
          [])
        .then(res => {
          console.log(res);
        });
      });
    }

    public saveConnectContact(connected, user, admin){
      var self = this;
      this.sqlite.create({
        name: 'ionicdb.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('INSERT INTO connectContact (connected, id_user, admin) VALUES (?, ?, ?)',
          [connected, user, admin])
        .then(res => {
          // empty
        });
      });
    };

    public disconnectContact(){
      this.sqlite.create({
        name: 'ionicdb.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('DELETE FROM connectContact',
          [])
        .then(res => {
          console.log(res);
        });
      });
    }

      public disconnectEnt(){
          this.sqlite.create({
              name: 'ionicdb.db',
              location: 'default'
          }).then((db: SQLiteObject) => {
              db.executeSql('DELETE FROM ent_selected',
                  [])
                  .then(res => {
                      console.log(res);
                  });
          });
      }

    public updateEntSelected(id_ent,inspect){
      console.log('ID_ENT');
      console.log(id_ent);
      if(inspect == 0){
        this.sqlite.create({
          name: 'ionicdb.db',
          location: 'default'
        }).then((db: SQLiteObject) => {
          db.executeSql('INSERT INTO ent_selected (id_ent) VALUES (?)',
            [id_ent])
            .then(res => {
              console.log(res);
            });
        });
      }else{
        console.log('id_ent',id_ent);
        this.sqlite.create({
          name: 'ionicdb.db',
          location: 'default'
        }).then((db: SQLiteObject) => {
          db.executeSql('UPDATE ent_selected SET id_ent=?',
            [id_ent])
            .then(res => {
              console.log("updateEntSelected");
              console.log(res);
            });
        });
      }
    };



  }
