import { Component, OnInit } from '@angular/core';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth, AngularFireAuthModule } from 'angularfire2/auth';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { moveIn, fallIn, moveInLeft } from '../router.animations';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, docChanges } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';

class Game {
  date: Date;
  numPlayers: number;
  players: string[];
  winner: string;
}

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
  selector: 'app-game-type-form',
  templateUrl: './game-type-form.component.html',
  styleUrls: ['./game-type-form.component.css'],
  animations: [moveIn(), fallIn(), moveInLeft()]
})
export class GameTypeFormComponent implements OnInit {
  userName: string;
  name: string;
  minPlayers: number;
  maxPlayers:number;
  photoUrl: string;
  acctId: string;
  playerDoc: AngularFirestoreDocument<Player>;
  playerVC: Observable<Player>;
  player: any;
  error: string;

  constructor(public af: AngularFireAuth,private router: Router, private afs: AngularFirestore) {
    this.af.authState.subscribe(auth => {
      if(auth) {
        this.userName = auth.displayName;
        this.photoUrl = auth.photoURL;
        this.acctId = auth.uid;
        this.getPlayerInfo();
      }
    });
  }

  ngOnInit() {
  }


  getPlayerInfo() {
    this.playerDoc = this.afs.doc('Players/' + this.acctId);
    this.playerVC = this.playerDoc.valueChanges();
    this.playerVC.subscribe(player => {
      this.player = player;
    })
  }

  addGame() {
    this.afs.doc('Games/'+this.name).ref.get().then((documentSnapshot) => {
      if(documentSnapshot.exists === true){
        this.error = "This already exists.";
      } else {
        this.afs.collection('Games').doc(this.name).set({'name':this.name, 'minPlayers': this.minPlayers, 'maxPlayers': this.maxPlayers});
        this.error = "Game Added!"
      }
    });
  }

}
