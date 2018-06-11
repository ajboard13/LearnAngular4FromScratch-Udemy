import { Component, OnInit } from '@angular/core';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth, AngularFireAuthModule } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { moveIn, fallIn, moveInLeft } from '../router.animations';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, docChanges } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Timestamp } from 'rxjs';

interface Player {
  UserName: string;
  isAdmin: boolean;
  numOfTwoPlayerWins: number;
  numOfThreePlayerWins: number;
  numOfFourPlayerWins: number;
  totalVictoryPoints: number;
  winPercent: number;
}

interface Game {
  date: Date;
  numPlayers: number;
  players: string[];
  winner: string;
}

interface Room {
  games: Game[];
  players: Player[];
  name: string;
  pass: string;
}

@Component({
  selector: 'app-other',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css'],
  animations: [moveIn(), fallIn(), moveInLeft()],
  host: {'[@moveIn]': ''}
})

export class MembersComponent implements OnInit {
  name: any;
  photoUrl: string;
  acctId: string;
  state: string = '';
  acctExists: boolean;

  player: AngularFirestoreDocument<Player>;
  currentPlayer: Observable<Player>;


  constructor(public af: AngularFireAuth,private router: Router, private afs: AngularFirestore) {
    this.acctExists = false;
    this.af.authState.subscribe(auth => {
      if(auth) {
        this.name = auth.displayName;
        this.photoUrl = auth.photoURL;
        this.acctId = auth.uid;
        this.getPlayerInfo();
      }
    });

  }
  
  getPlayerInfo() {
    this.player = this.afs.doc('Players/' + this.acctId);
    this.currentPlayer = this.player.valueChanges();
    this.afs.firestore.doc('Players/' + this.acctId).get().then(docChanges => {
      if(docChanges.exists) {
        this.acctExists = true;
      }
    })
    
    console.log(this.currentPlayer);
    console.log('Players/' + this.acctId);
  }

  logout() {
     this.af.auth.signOut();
     this.router.navigateByUrl('/login');
  }

  ngOnInit() {
  }

}