import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ChatWindowComponent } from './chat-window/chat-window.component';
import {RouterModule, Routes} from "@angular/router";
import {AuthGuard} from "./auth/auth.guard";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {AuthInterceptor} from "./auth/http.interceptor";
import { ChatDetailComponent } from './chat-detail/chat-detail.component';
import { ChatUsernamePipe } from './chat-window/chat-username.pipe';
import { LogoutComponent } from './logout/logout.component';

const routes: Routes = [
  {path: 'chat', component: ChatWindowComponent, canActivate: [AuthGuard]},
  {path: 'chat/:id', component: ChatDetailComponent, canActivate: [AuthGuard]},
  {path: 'login', component: LoginComponent},
  {path: 'logout', component: LogoutComponent},
  {path: '**', redirectTo: "login"}
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ChatWindowComponent,
    ChatDetailComponent,
    ChatUsernamePipe,
    LogoutComponent,
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    HttpClientModule,
  ],
  exports:[
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
export class AppModule { }
