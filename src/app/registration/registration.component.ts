import { Component, OnInit } from '@angular/core';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth, AngularFireAuthModule } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { moveIn, fallIn, moveInLeft } from '../router.animations';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

interface Player {
  UserName: string;
  isAdmin: boolean;
  numOfTwoPlayerWins: number;
  numOfThreePlayerWins: number;
  numOfFourPlayerWins: number;
  totalVictoryPoints: number;
  winPercent: number;
}

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  newPlayer : Player;
  UserName: string;
  userId: string;
  error: string;

  constructor(public af: AngularFireAuth,private router: Router, private afs: AngularFirestore) { 
    this.af.authState.subscribe(auth => {
      if(auth) {
        this.userId = auth.uid;
      }
    });
  }

  ngOnInit() {
  }
  addPlayer() {
    if(this.UserName == "" || this.UserName == undefined){
      this.error = "Username can not be empty"
    } 
    else {
      this.afs.collection('Players').doc(this.userId).set({'UserName': this.UserName, 'isAdmin': false, 'acctId':this.userId, 'totalWins':0, 'winPercent':0});
      this.goHome();
    }
  }

  goHome() {
    this.router.navigateByUrl('/members');
  }

}
