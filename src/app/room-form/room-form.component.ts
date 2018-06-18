import { Component, OnInit } from '@angular/core';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth, AngularFireAuthModule } from 'angularfire2/auth';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { moveIn, fallIn, moveInLeft } from '../router.animations';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, docChanges } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';


interface GameType {
  name: string;
  minPlayers: number;
  maxPlayers: number;
}

interface Player {
  UserName: string;
  isAdmin: boolean;
  numOfTwoPlayerWins: number;
  numOfThreePlayerWins: number;
  numOfFourPlayerWins: number;
  totalVictoryPoints: number;
  winPercent: number;
  acctId: string;
}

@Component({
  selector: 'app-room-form',
  templateUrl: './room-form.component.html',
  styleUrls: ['./room-form.component.css'],
  animations: [moveIn(), fallIn(), moveInLeft()]
})
export class RoomFormComponent implements OnInit {

  gamesCol: AngularFirestoreCollection<GameType>;
  games: Observable<GameType[]>;
  gameType: any;
  roomName: string;
  roomPassword: string = '';
  playerDoc: AngularFirestoreDocument<Player>;
  playerVC: Observable<Player>;
  player: Player;
  name: string;
  photoUrl: string;
  acctId: string;
  error: string;
  exists:boolean = false;
  winTypes ={};
  isLocked:boolean;

  constructor(public af: AngularFireAuth,private router: Router, private afs: AngularFirestore) {
    this.af.authState.subscribe(auth => {
      if(auth) {
        this.name = auth.displayName;
        this.photoUrl = auth.photoURL;
        this.acctId = auth.uid;
        this.getPlayerInfo();
      }
    });
  }

  ngOnInit() {
    this.getGames();
  }

  getGames(){
    this.gamesCol = this.afs.collection('Games');
    this.games = this.gamesCol.valueChanges();
  }

  getPlayerInfo() {
    this.playerDoc = this.afs.doc('Players/' + this.acctId);
    this.playerVC = this.playerDoc.valueChanges();
    this.playerVC.subscribe(player => {
      this.player = player;
    })
  }

  addRoom(){
    for(var i = JSON.parse(this.gameType).minPlayers; i <= JSON.parse(this.gameType).maxPlayers; i++){
      this.winTypes[i+'PlayerWins'] = 0;
    }
    this.afs.doc('Rooms/'+this.roomName).ref.get().then((documentSnapshot) => {
      if(documentSnapshot.exists === true){
        this.error = "This already exists.";
      } else {
        this.addRoomDoc();
        this.goBack();
      }
    });
  }

  addRoomDoc(){

    if(this.roomPassword == ''){
      this.isLocked = false;
    } else {
      this.isLocked = true;
    }
    this.afs.collection('Rooms').doc(this.roomName).set({'roomName': this.roomName, 'roomPassword': this.roomPassword, 'isLocked':this.isLocked, 'gameType': JSON.parse(this.gameType).name, 'playerCount': 1, 'minPlayers': JSON.parse(this.gameType).minPlayers, 'maxPlayers': JSON.parse(this.gameType).maxPlayers});
    this.afs.collection('Rooms/'+this.roomName+'/Players').doc(this.acctId).set({'UserName': this.player.UserName,'acctId':this.player.acctId, 'isAdmin': true, 'totalWins': 0, 'winPercent':0, 'winTypes': this.winTypes})
  }

  goBack(){
    this.router.navigateByUrl('/members');
  }

}
