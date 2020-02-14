import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from "../services/authentication.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {

  constructor(private authenticationService: AuthenticationService) {}


  ngOnInit() {

  }

  // signUp() {
  //   this.authenticationService.SignUp(this.email, this.password);
  //   this.email = "";
  //   this.password = "";
  // }

  signIn(emailInput, passwordInput) {

    let emailValue = emailInput.value;
    let passwordValue = passwordInput.value;

    this.authenticationService.SignIn(
      emailValue,
      passwordValue,
      callback => {
        console.log("This is login success" + callback);

        location.reload();
      },
      errCallback => {
        console.log(errCallback);
      }
    );

  }

  signOut() {
    this.authenticationService.SignOut();
  }
}
