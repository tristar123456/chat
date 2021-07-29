import {Injectable} from '@angular/core';
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
  ) {
  }

  public getUsername(): string{
    return this.authService.getUsername();
  }

  public getChats(): Promise<Chat[]> {
    return this.httpClient.get<Chat[]>(environment.apiUrl + "/chat").toPromise().catch(
      error => {
        console.log(error);
        this.authService.logout();
        this.router.navigate(["login"]);
        return [] as Chat[];
      }
    );
  }

  async getChat(username2: string): Promise<Message[]> {
    return this.httpClient.get<Message[]>(environment.apiUrl + "/chat/" + username2).toPromise().catch(
      error => {
        console.log(error);
        if (error.status === 401) {
          this.authService.logout();
          this.router.navigate(["login"]);
        }
        return {} as Message[];
      }
    );
  }

  public addChat(username2: string): Promise<string> {
    return this.httpClient.put<string>(environment.apiUrl + "/chat", {
      name: username2
    }).toPromise().catch(
      error => {
        console.log(error);
        if (error.status === 401) {
          this.authService.logout();
          this.router.navigate(["login"]);
        }
        return "";
      }
    );
  }

  public sendMsg(chatId: string, msgText: string) {
    let msg: Message = {} as Message;
    msg.cid = chatId;
    msg.frm = this.getUsername();
    msg.txt = msgText;

    return this.httpClient.put<Chat>(environment.apiUrl + "/chat/" + chatId,
      msg
    ).toPromise().catch(
      error => {
        console.log(error);
        if (error.status === 401) {
          this.authService.logout();
          this.router.navigate(["login"]);
        }
        return {} as Chat;
      }
    );
  }

  public addUser(username: string, password: string): Promise<string> {
    return this.httpClient.put<string>(environment.apiUrl + "/user",
      {
        username,
        password
      }
    ).toPromise().catch(
      error => {
        console.log(error);
        if (error.status === 401) {
          this.authService.logout();
          this.router.navigate(["login"]);
        }
        return "";
      }
    );
  }

  public searchUser(search: string): Promise<string[]> {
    return this.httpClient.post<string[]>(environment.apiUrl + "/user",
      {
        search: search
      }
    ).toPromise().catch(
      error => {
        console.log(error);
        if (error.status === 401) {
          this.authService.logout();
          this.router.navigate(["login"]);
        }
        return [];
      }
    );
  }
}
