import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../environments/environment";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {AuthService} from "./auth/auth.service";
import {Router} from "@angular/router";
import {Chat} from "./chat-detail/Chat";
import {Message} from "./chat-detail/Message";

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor(
    private authService: AuthService,
    private httpClient: HttpClient,
    private router: Router
  ) { }

  public getUsername(): string{
    let username = this.authService.getUsername();
    if ( !!username){
      return username
    }
    return "none";
  }

  public getChats(): Promise<Chat[]>{
    return this.httpClient.get<Chat[]>(environment.apiUrl +"/chat").toPromise().catch(
      error => {
        console.log(error);
        this.authService.logout();
        this.router.navigate(["login"]);
        return [] as Chat[];
      }
    );
  }

  async getChat(id: string): Promise<Message[]> {
    return this.httpClient.get<Message[]>(environment.apiUrl +"/chat/"+id).toPromise().catch(
      error => {
        console.log(error);
        if ( error.status === 401){
          this.authService.logout();
          this.router.navigate(["login"]);
        }
        return {} as Message[];
      }
    );
  }

  sendMsg(chatId: string, msgText: string) {
    let msg: Message = {} as Message;
    msg.cid = chatId;
    msg.frm = this.getUsername();
    msg.txt = msgText;

    return this.httpClient.put<Chat>(environment.apiUrl +"/chat/" + chatId,
      msg
    ).toPromise().catch(
      error => {
        console.log(error);
        if ( error.status === 401){
          this.authService.logout();
          this.router.navigate(["login"]);
        }
        return {} as Chat;
      }
    );
  }
}