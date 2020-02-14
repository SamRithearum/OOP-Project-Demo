import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError} from 'rxjs';
import { catchError} from 'rxjs/operators';

import * as crypto from 'crypto-js';
import { LoadingController, AlertController } from '@ionic/angular';


const httpOptionss = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};


@Injectable()
export class Service  {

  loading : any;
  keyString = "5c68119d-452b-4f2e-9a1d-f04977f7fbc4";


  mlapDomainUrl: string = "https://api.mlab.com/api/1/databases/landdriller/";
  api : string = "?apiKey=aX8HPIvy2M_yBh5WhZkHFwZdrIbd3UX_";

  projectColl : String = "Projects";
  userColl : String = "Users";
  noteColl : String = "Notes";

  userObj: any;


  constructor(public http: HttpClient, private loadingController : LoadingController, private alertController : AlertController) {
    this.userObj = this.getStoreUserData();
  }

  generateUUID() {
    let d = new Date().getTime();
    let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      let r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  };

  generateUUID4() {
    let d = new Date().getTime();
    let uuid = 'xxxxxxxx'.replace(/[xy]/g, function (c) {
      let r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(4);
    });
    return uuid;
  };

  getProjectBySkipAndLimit(limit : number, skip : number, province : string) {
    let url: string = this.mlapDomainUrl + "collections/" + this.projectColl + this.api + "&sk=" + skip + "&l=" + limit + "&q={ 'province' : '" + province + "' }&s={'timestamp': -1}";
    return this.http.get(url, httpOptionss).pipe(catchError(this.handleError));
  }

  deleteProject(project : any) {
    let url: string = this.mlapDomainUrl + "collections/" + this.projectColl + "/" + project._id + this.api;
    return this.http.delete(url, httpOptionss).pipe(catchError(this.handleError));
  }

  getProjectSearch(name : string) {
    let url: string = this.mlapDomainUrl + "collections/" + this.projectColl + this.api + "&q={ 'name' : { '$regex' : '" + name + "' } }&s={'timestamp': -1}";
    return this.http.get(url, httpOptionss).pipe(catchError(this.handleError));
  }

  getProjectDetailByProjectId(theId : string)  {

  }

  postProject(projectObj : any) : Observable<any> {
    
    projectObj._id = this.generateUUID4();
    projectObj.timestamp = Math.floor(Date.now() / 1000);

    let url: string = this.mlapDomainUrl + "collections/" + this.projectColl + this.api;
    let body = JSON.stringify(projectObj);
    return this.http.post(url, body, httpOptionss).pipe(catchError(this.handleError));
  }

  putProjectDetail(projectObj : any) : Observable<any> {
    let url: string = this.mlapDomainUrl + "collections/" + this.projectColl + "/" + projectObj._id + this.api;
    let body = JSON.stringify(projectObj);
    return this.http.put(url, body, httpOptionss).pipe(catchError(this.handleError));
  }

  getNoteBySkipAndLimit(limit: number, skip : number) {
    let url: string = this.mlapDomainUrl + "collections/" + this.noteColl + this.api + "&sk=" + skip + "&l=" + limit + "&s={'timestamp': -1}";
    return this.http.get(url, httpOptionss).pipe(catchError(this.handleError));
  }

  getNoteDetailById(limit : number, skip : number ) {

  }

  authorizeUserLogin(username : string, password : string) : Observable<any> {
    let url: string = this.mlapDomainUrl + "collections/" + this.userColl + this.api + "&q={'username': '" + username + "', 'password' : '" + password + "'}&l=1";
    return this.http.get(url, httpOptionss).pipe(catchError(this.handleError));
  }

  getAllUser() {

  }

  postNote(noteObj : any) {

  }

  putNote(noteObj : any) {

  }

  deleteNote(noteObj : any) {

  }


  onUrl(url) {
    window.open(url, '_blank');
  }


  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    return throwError('Something bad happened; please try again later.');
  }


  errorValidateion(error): Observable<any> {
    let err = {
      error: (error.statusText) ? error : 'Server error'
    }
    return Observable.throw(err)
  }




  encrypted(theMsg): string {
    return crypto.AES.encrypt(theMsg, this.keyString).toString();
  }

  decrypted(encryp): string {
    try {
      let data = crypto.AES.decrypt(encryp, this.keyString)
      return data.toString(crypto.enc.Utf8);
    } catch (e) {
      localStorage.clear();
      location.reload();
    }
  }

  getStoreUserData() {
    if (localStorage.getItem("USDD")){
      return JSON.parse(this.decrypted(localStorage.getItem("USDD")));
    }else{
      return null;
    }

  }

  setStoreUserData(user) {
    localStorage.setItem("USDD", user);
  }

  async showMessage(msg : string) {
    const alert = await this.alertController.create({
      header: 'Information',
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      message: "Loading..."
    });
    await this.loading.present();
  }

  hideLoading() {
    this.loading.dismiss();
  }



}



