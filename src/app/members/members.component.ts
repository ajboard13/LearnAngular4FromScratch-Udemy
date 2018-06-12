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

  roomsCollection: AngularFirestoreCollection<Room>;
  rooms: any;

  player: AngularFirestoreDocument<Player>;
  currentPlayer: Observable<Player>;



  constructor(public af: AngularFireAuth,private router: Router, private afs: AngularFirestore) {
    this.af.authState.subscribe(auth => {
      if(auth) {
        this.name = auth.displayName;
        this.photoUrl = auth.photoURL;
        this.acctId = auth.uid;
        this.getPlayerInfo();
        this.getRooms();
      }
    });

  }
  
  getPlayerInfo() {
    this.player = this.afs.doc('Players/' + this.acctId);
    this.currentPlayer = this.player.valueChanges();
  }

  getRooms() {
    this.roomsCollection = this.afs.collection('Rooms');
    this.rooms = this.roomsCollection.snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Room;
        const id = a.payload.doc.id;
        return{id, data}
      })
    });
  }

  goToRoom(roomId){
    this.router.navigate(['/room', {'roomId':roomId}]);
  }

  logout() {
     this.af.auth.signOut();
     this.router.navigateByUrl('/login');
  }

  ngOnInit() {
  }

}