import { Component, OnInit, HostBinding } from '@angular/core';
import { AngularFireAuth, AngularFireAuthModule } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { moveIn } from '../router.animations';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [moveIn()],
  host: {'[@moveIn]': ''}
})
export class LoginComponent implements OnInit {

  error: any;
  constructor(public af: AngularFireAuth,private router: Router) {

      this.af.authState.subscribe(auth => { 
      if(auth) {
        this.router.navigateByUrl('/members');
      }
    });

  }

  loginFb() {
    this.af.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider());
  }

  loginGoogle() {
    this.af.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  ngOnInit() {
  }

}
