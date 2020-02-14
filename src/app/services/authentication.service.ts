import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { Observable } from 'rxjs';
 
@Injectable({
  providedIn: 'root'
})
 
export class AuthenticationService {
  
userData: Observable<firebase.User>;

 
constructor(private angularFireAuth: AngularFireAuth) {
this.userData = angularFireAuth.authState;
}
 
  /* Sign up */
  SignUp(email: string, password: string) {
  this.angularFireAuth
  .auth
  .createUserWithEmailAndPassword(email, password)
  .then(res => {
  console.log('You are Successfully signed up!', res);
  })
  .catch(error => {
  console.log('Something is wrong:', error.message);
  });
  }
  
  /* Sign in */
  SignIn(email: string, password: string, callback, errCallback) {
  this.angularFireAuth
  .auth
  .signInWithEmailAndPassword(email, password)
  .then(res => {
    callback(res);
  })
  .catch(err => {
    errCallback(err);
  });
  }

  /* get current user */
  GetUser(callback) {
    this.angularFireAuth.user.subscribe(data => {
      callback(data);
    });
  }

  /* Sign out */
  SignOut() {
  return this.angularFireAuth
  .auth
  .signOut();
}
}