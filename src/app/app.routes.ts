import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { MembersComponent } from './members/members.component';
import { AuthGuard } from './auth.service';
import { SignupComponent } from './signup/signup.component';
import { EmailComponent } from './email/email.component';
import { RegistrationComponent } from './registration/registration.component';
import { RoomComponent } from './room/room.component';
import { GameFormComponent } from './game-form/game-form.component';
import { RoomFormComponent } from './room-form/room-form.component';
import { GameTypeFormComponent } from './game-type-form/game-type-form.component';
import { RoomSignInComponent } from './room-sign-in/room-sign-in.component';

export const router: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'login-email', component: EmailComponent },
    { path: 'members', component: MembersComponent },
    { path: 'registration', component: RegistrationComponent },
    { path: 'room', component: RoomComponent },
    { path: 'add-game', component: GameFormComponent },
    { path: 'room-form', component: RoomFormComponent},
    { path: 'game-type-form', component: GameTypeFormComponent},
    { path: 'room-sign-in', component: RoomSignInComponent}

]

export const routes: ModuleWithProviders = RouterModule.forRoot(router);