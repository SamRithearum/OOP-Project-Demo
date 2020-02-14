import { Component } from '@angular/core';

import { Platform, ModalController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { LoginComponent } from './login/login.component';
import { AuthenticationService } from "./services/authentication.service";


@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"]
})
export class AppComponent {
  public appPages = [
    {
      title: "HomePage",
      url: "/home",
      icon: "home"
    }
  ];

  userData: String;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private modCtrl: ModalController,
    private service: AuthenticationService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.onLogin();
      //this.onLogout();
    });
  }

  onLogout() {
    this.service.SignOut();
    localStorage.clear();
    location.reload();
  }

  onLogin() {

   this.service.GetUser(user => {


      if (user) {
        this.userData = user.email;
        return;
      }

      this.loginOperation();

   });

  }

  async loginOperation() {

     const modal = await this.modCtrl.create({
       component: LoginComponent,
       componentProps: {}
     });

     modal.backdropDismiss = false;
     return await modal.present();

  }


}


