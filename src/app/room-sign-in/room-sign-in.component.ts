import { Component, OnInit } from '@angular/core';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth, AngularFireAuthModule } from 'angularfire2/auth';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { moveIn, fallIn, moveInLeft } from '../router.animations';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, docChanges } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Timestamp } from 'rxjs';

interface Player {
  UserName: string;
  isAdmin: boolean;
  winPercent: number;
  acctId:string;
}

interface Room {
  games: string[];
  players: string[];
  roomName: string;
  roomPassword: string;
  gameType: string;
  playerCount: number;
}

@Component({
  selector: 'app-room-sign-in',
  templateUrl: './room-sign-in.component.html',
  styleUrls: ['./room-sign-in.component.css'],
  animations: [moveIn(), fallIn(), moveInLeft()]
})
export class RoomSignInComponent implements OnInit {
  name:string;
  photoUrl:string;
  acctId:string;
  roomDoc: AngularFirestoreDocument<Room>;
  room: Observable<Room>;
  roomId: string;
  roomPass: string;
  error: string;
  playerCol: AngularFirestoreCollection<Player>;

  constructor(public af: AngularFireAuth,private router: Router, private afs: AngularFirestore, private route: ActivatedRoute) {
    this.af.authState.subscribe(auth => {
      if(auth) {
        this.name = auth.displayName;
        this.photoUrl = auth.photoURL;
        this.acctId = auth.uid;
      }
    });
  }

  getRoomId() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      let id = params.get('roomId');
      this.roomId = id;
    });
  }

  getRoomInfo() {
    this.roomDoc = this.afs.doc('Rooms/' + this.roomId);
    this.room = this.roomDoc.valueChanges();
  }

  logInToRoom() {
    this.roomDoc.valueChanges().subscribe(roomInfo => {
      if (this.roomPass == roomInfo.roomPassword) {
        this.router.navigate(['/room', {'roomId':this.roomId}]);
      } else {
        this.error = "Wrong Password";
      }
    });
  }

  checkIfPlayerInRoom() {
    this.playerCol = this.afs.collection('Rooms/'+this.roomId+'/Players/');
    this.playerCol.valueChanges().subscribe(players => {
      for(let player of players) {
        if(this.acctId == player.acctId){
          this.router.navigate(['/room', {'roomId':this.roomId}]);    
        }
      }
    });
  }

  logout() {
    this.af.auth.signOut();
    this.router.navigateByUrl('/login');
  }

  goHome() {
    this.router.navigateByUrl('/members');
  }

  ngOnInit() {
    this.getRoomId();
    this.getRoomInfo();
    this.checkIfPlayerInRoom();
  }

}
