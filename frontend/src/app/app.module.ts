import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {LoginComponent} from './login/login.component';
import {ChatWindowComponent} from './chat-window/chat-window.component';
import {RouterModule, Routes} from "@angular/router";
import {AuthGuard} from "./auth/auth.guard";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {AuthInterceptor} from "./auth/http.interceptor";
import {ChatDetailComponent} from './chat-detail/chat-detail.component';
import {ChatUsernamePipe} from './chat-window/chat-username.pipe';
import {LogoutComponent} from './logout/logout.component';
import {RegisterComponent} from './register/register.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {HeaderComponent} from './header/header.component';
import {SizeDetectorComponent} from "./size-detector/size-detector.component";
import {UserComponent} from './user/user.component';
import {MatError} from "@angular/material/form-field";
import {ReactiveFormsModule} from "@angular/forms";

const routes: Routes = [
  {path: 'chat', component: ChatWindowComponent, canActivate: [AuthGuard], children:[
      {path: ':id', component: ChatDetailComponent}
  ]},
  {path: 'user', component: UserComponent, canActivate: [AuthGuard]},
  {path: 'login', component: LoginComponent,},
  {path: 'logout', component: LogoutComponent, canActivate: [AuthGuard]},
  {path: 'register', component: RegisterComponent},
  {path: '**', component: LoginComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ChatWindowComponent,
    ChatDetailComponent,
    ChatUsernamePipe,
    LogoutComponent,
    RegisterComponent,
    HeaderComponent,
    SizeDetectorComponent,
    UserComponent,
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule
  ],
  exports: [
    RouterModule
  ],
  providers: [
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }

  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
