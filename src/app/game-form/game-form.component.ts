import { Component, OnInit } from '@angular/core';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth, AngularFireAuthModule } from 'angularfire2/auth';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { moveIn, fallIn, moveInLeft } from '../router.animations';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, docChanges } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forEach } from '@firebase/util';

interface Player {
  UserName: string;
  acctId: string;
  isAdmin: boolean;
  numOfTwoPlayerWins: number;
  numOfThreePlayerWins: number;
  numOfFourPlayerWins: number;
  totalVictoryPoints: number;
  winPercent: number;
}
class Game {
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
  selector: 'app-game-form',
  templateUrl: './game-form.component.html',
  styleUrls: ['./game-form.component.css'],
  animations: [moveIn(), fallIn(), moveInLeft()]
})
export class GameFormComponent implements OnInit {

  numPlayers: number;
  playersCol: AngularFirestoreCollection<Player>;
  players: Observable<Player[]>;
  gamePlayers: string[];
  roomDoc: AngularFirestoreDocument<Room>;
  currentRoom: Observable<Room>;
  roomId: string;
  winner: string;
  winnerSelect: any;
  gForm:FormGroup;
  game: Game;

  constructor(public af: AngularFireAuth,private router: Router, private afs: AngularFirestore, private route: ActivatedRoute, private fb: FormBuilder) {
    this.gForm = fb.group({
    'numPlayers' : [null, Validators.required],
    'players' : [null, Validators.required],
    'winner' : [null, Validators.required],
    'validate' : ''
  });
  }

  addGame(game){
    this.winner = document.getElementById("winner-select").value;
    this.game = new Game();
    this.game.players = game.gamePlayers;
    this.game.date = new Date();
    this.game.numPlayers = this.numPlayers;
    this.game.winner = this.winner;
    console.log(this.game);
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      let id = params.get('roomId');
      this.roomId = id;
    })
    this.getRoomInfo();
    this.numPlayers = 2;
    this.winnerSelect = document.getElementById("winner-select")
    this.winnerSelect.addEventListener("change", this.updateWinner);
    console.log(this.players);
  }

  getRoomInfo() {
    this.roomDoc = this.afs.doc('Rooms/' + this.roomId);
    this.currentRoom = this.roomDoc.valueChanges();
    this.getPlayersInfo();
  }

  getPlayersInfo() {
    this.playersCol = this.afs.collection('Rooms/'+this.roomId+'/Players/');
    this.players = this.playersCol.valueChanges();
  }

  updateWinner(){
    this.winner = document.getElementById("winner-select").value;
    console.log(this.winner);
  }
}
