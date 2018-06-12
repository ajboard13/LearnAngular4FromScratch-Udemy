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
  player: AngularFirestoreDocument<Player>;
  currentPlayer: Observable<Player>;
  roomId: string;
  playersCol: AngularFirestoreCollection<Player>;
  players: Observable<Player[]>;
  gamesCol: AngularFirestoreCollection<Game>;
  games: Observable<Game[]>;

  roomDoc: AngularFirestoreDocument<Room>;
  currentRoom: Observable<Room>;

  constructor(public af: AngularFireAuth,private router: Router, private afs: AngularFirestore, private route: ActivatedRoute) {
    this.af.authState.subscribe(auth => {
      if(auth) {
        this.name = auth.displayName;
        this.photoUrl = auth.photoURL;
        this.acctId = auth.uid;
        this.getPlayerInfo();
      }
    });
  }
  getRoomInfo() {
    this.roomDoc = this.afs.doc('Rooms/' + this.roomId);
    this.currentRoom = this.roomDoc.valueChanges();
    this.getPlayerInfo();
    this.getPlayersInfo();
    this.getGamesInfo();
  }

  getPlayerInfo() {
    this.player = this.afs.doc('Players/' + this.acctId);
    this.currentPlayer = this.player.valueChanges();
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

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      let id = params.get('roomId');
      this.roomId = id;
    })
    this.getRoomInfo();
  }

}
