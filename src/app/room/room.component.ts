import { Component, OnInit } from '@angular/core';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth, AngularFireAuthModule } from 'angularfire2/auth';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { moveIn, fallIn, moveInLeft } from '../router.animations';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, docChanges } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { forEach } from '@firebase/util';


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
  games: string[];
  players: string[];
  name: string;
  pass: string;
  gameType: string;
  playerCount: number;
}

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css'],
  animations: [moveIn(), fallIn(), moveInLeft()]
})
export class RoomComponent implements OnInit {

  name: any;
  photoUrl: string;
  acctId: string;
  roomId: string;
  playersCol: AngularFirestoreCollection<Player>;
  players: Observable<Player[]>;
  gamesCol: AngularFirestoreCollection<Game>;
  games: Observable<Game[]>;
  playerDoc: AngularFirestoreDocument<Player>;
  playerVC: Observable<Player>;
  player: any;
  gameDoc: AngularFirestoreDocument<Game>;
  gameVC: Observable<Game>;
  gameName:string;
  gameType:any;
  winTypes= {};
  isInRoom: boolean = true;
  playerCount: number;

  roomDoc: AngularFirestoreDocument<Room>;
  currentRoom: Observable<Room>;
  room: any;

  constructor(public af: AngularFireAuth,private router: Router, private afs: AngularFirestore, private route: ActivatedRoute) {
  }
  getRoomInfo() {
    this.roomDoc = this.afs.doc('Rooms/' + this.roomId);
    this.currentRoom = this.roomDoc.valueChanges();
    this.currentRoom.subscribe(room => {
      this.gameName = room.gameType;
      this.playerCount = room.playerCount;
      this.getGameTypeInfo();
    });
    this.getGamesInfo();
  }

  getGameTypeInfo() {
    this.gameDoc = this.afs.doc('Games/'+this.gameName);
    this.gameVC = this.gameDoc.valueChanges();
    this.gameVC.subscribe(game => {
      this.gameType = game;
      this.setWinTypeObj();
    });
  }

  setWinTypeObj() {
    for(var i = this.gameType.minPlayers; i <= this.gameType.maxPlayers; i++){
      this.winTypes[i+'PlayerWins'] = 0;
    }
  }

  getPlayerInfo() {
    this.playerDoc = this.afs.doc('Players/' + this.acctId);
    this.playerVC = this.playerDoc.valueChanges();
    this.playerVC.subscribe(player => {
      this.player = player;
      this.checkIfPlayerInRoom();
    });
  }

  getPlayersInfo() {
    this.playersCol = this.afs.collection('Rooms/'+this.roomId+'/Players/');
    this.players = this.playersCol.valueChanges();
  }

  getGamesInfo() {
    this.gamesCol = this.afs.collection('Rooms/'+this.roomId+'/Games/');
    this.games = this.gamesCol.valueChanges();
  }

  goHome() {
    this.router.navigateByUrl('/members');
  }

  createGame() {
    this.router.navigate(['/add-game', {'roomId':this.roomId}])
  }

  logout() {
     this.af.auth.signOut();
     this.router.navigateByUrl('/login');
  }

  checkIfPlayerInRoom() {
    this.afs.doc('Rooms/'+this.roomId+'/Players/'+this.acctId).ref.get().then((documentSnapshot) => {
      if(documentSnapshot.exists !== true){
        this.isInRoom = false;
        this.afs.collection('Rooms/'+this.roomId + '/Players').doc(this.acctId).set({'UserName': this.player.UserName, 'isAdmin':false, 'acctId': this.acctId, 'totalWins':0, 'winPercent': 0, 'winTypes':this.winTypes});
        this.afs.doc('Rooms/'+this.roomId).update({'playerCount': this.playerCount+1});
      } else {
        this.isInRoom = true;
      }
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      let id = params.get('roomId');
      this.roomId = id;
    });
    this.af.authState.subscribe(auth => {
      if(auth) {
        this.name = auth.displayName;
        this.photoUrl = auth.photoURL;
        this.acctId = auth.uid;
        this.getPlayerInfo();
        this.getRoomInfo();
        this.getPlayersInfo();
      }
    });
  }

}
