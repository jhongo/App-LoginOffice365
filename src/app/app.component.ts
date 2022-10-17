import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

import { InAppBrowser, InAppBrowserEvent } from '@ionic-native/in-app-browser';

import { ConfigProvider } from './config';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any = HomePage;
  pages: Array<{ title: string, component: any }>;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public iab: InAppBrowser,
    public _config: ConfigProvider
  ) {
    this.initializeApp();
    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'List', component: ListPage }
    ];
    this.login();

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  login() {
    this.splashScreen.show();

    const url = `https://login.microsoftonline.com/common/oauth2/authorize?client_id=`
      + this._config.clientId + //here need to paste your client id
      `&response_type=code&redirect_uri=`
      + encodeURI(this._config.redirectUri) + //here encoding redirect url using default function
      `&response_mode=query&resource=`
      + encodeURI(this._config.resourceUrl) + //here encoding resource url using default function
      `&state=12345`;

    const browser = this.iab.create(url, '_blank', {
      location: 'no',
      zoom: 'no',
      hardwareback: 'no',
      clearcache: 'yes'
    });

    browser.on("loadstart").subscribe((event) => {
      this.splashScreen.show();
    });

    browser.on("loadstop").subscribe((event) => {
      this.splashScreen.hide();
      browser.show();
    });

    browser.on("loaderror").subscribe((event) => {
      //here we have split our requiring part one.   
      var result = event.url.split("code=");      
      console.log("Authentication result", result);
      //here we have split our requiring part two.
      window["AuthResult"] = result[1].split('&')[0];     
      // Authentication Code stored in local for future purpose.
      // It means get access token and refresh token for sharepoint.      
      localStorage.setItem('AuthCode', window["AuthResult"]);  
      browser.close();
    });


    browser.on("exit").subscribe(
      (event) => {
        //Below line for checking if closing event
        if (event) {
          if (event.type.toLowerCase() == 'exit') {
            if (localStorage.getItem("AuthCode") && localStorage.getItem("AuthCode") == 'cancel') {
              this.platform.exitApp();  //This line is used for close a app. In case not loggedin.
              event.preventDefault();
              return true;
            }
          }
        }
      },
      (err) => {
        console.log("InAppBrowser Loadstop Event Error: " + err);
      }
    );
  }

}
