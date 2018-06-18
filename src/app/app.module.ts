import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormArray } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AngularFireModule } from 'angularfire2';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { EmailComponent } from './email/email.component';
import { SignupComponent } from './signup/signup.component';
import { MembersComponent } from './members/members.component';
import { AuthGuard } from './auth.service';
import { routes } from './app.routes';
import { AngularFireAuth, AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RegistrationComponent } from './registration/registration.component';
import { RoomComponent } from './room/room.component';
import { GameFormComponent } from './game-form/game-form.component';
import { RoomFormComponent } from './room-form/room-form.component';
import { GameTypeFormComponent } from './game-type-form/game-type-form.component';
import { RoomSignInComponent } from './room-sign-in/room-sign-in.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

export const firebaseConfig = {
  apiKey: 'AIzaSyBoIS_aIZhjpaBUpU-DGvAZQ17_IsGb5AU',
  authDomain: 'dominioncounter.firebaseapp.com',
  databaseURL: 'https://dominioncounter.firebaseio.com',
  storageBucket: 'dominioncounter.appspot.com',
  messagingSenderId: '450009917595',
  projectId: 'dominioncounter'
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    EmailComponent,
    SignupComponent,
    MembersComponent,
    RegistrationComponent,
    RoomComponent,
    GameFormComponent,
    RoomFormComponent,
    GameTypeFormComponent,
    RoomSignInComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AngularFireAuthModule,
    AngularFireModule.initializeApp(firebaseConfig),
    routes,
    AngularFirestoreModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    InfiniteScrollModule
    
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
