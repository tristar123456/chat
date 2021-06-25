import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Router} from "@angular/router";

const LOGIN_URL = '/login';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authenticated: boolean = false;
  private username: string| undefined;

  constructor(
    private httpClient: HttpClient,
    private router: Router
  ) {
    if (localStorage.getItem(environment.sessionStorageKey)){
      this.checkAuth().then(
        username => {
          this.authenticated = true;
          this.username = username;
          this.router.navigate(["chat"]);
        }
      );
    }
  }

  public async login(username: string, password: string): Promise<boolean> {
    await this.httpClient.post<string>(environment.apiUrl + LOGIN_URL, {
      username, password
    }).toPromise().then( res => {
      if (!!res) {
        this.authenticated = true;
        this.username = username;
        localStorage.setItem(environment.sessionStorageKey, res);
      }
    }).catch( error => {
      console.log(error.status)
    });
    return this.authenticated;
  }

  private async checkAuth(): Promise<string|undefined>{
    return await this.httpClient.post<string>(environment.apiUrl + "/checkauth", {}).toPromise().catch(
      err => {
        console.log(err);
        return undefined;
      }
    );
  }

  public isAuthenticated(): boolean {
    return this.authenticated;
  }

  public getUsername(): string | undefined{
    return this.username;
  }

  public logout(): void {
    this.authenticated = false;
    localStorage.removeItem(environment.sessionStorageKey)
  }
}
