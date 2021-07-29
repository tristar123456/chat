import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Router} from "@angular/router";
import {BehaviorSubject, Observable} from "rxjs";
import {subscribeTo} from "rxjs/internal-compatibility";

const LOGIN_URL = '/login';

@Injectable({
  providedIn: 'root'
})
export class AuthService{

  private authenticated$ = new BehaviorSubject<boolean>(false)
  private username$ = new BehaviorSubject<string>("");

  constructor(
    private httpClient: HttpClient,
    private router: Router
  ) {
    if (localStorage.getItem(environment.sessionStorageKey)){
      this.checkAuth().then(
        username => {
          if( username !== ""){
            this.username$.next(username!);
          } else {
            this.username$.next("none");
          }
          this.authenticated$.next(true);
        }
      );
    }
  }

  public async login(username: string, password: string): Promise<boolean> {
    await this.httpClient.post<string>(environment.apiUrl + LOGIN_URL, {
      username, password
    }).toPromise().then( res => {
      if (!!res) {
        this.username$.next(username);
        this.authenticated$.next(true);
        localStorage.setItem(environment.sessionStorageKey, res);
      }
    }).catch( error => {
      console.log(error.status)
    });
    return this.authenticated$.value;
  }

  private async checkAuth(): Promise<string|undefined>{
    return await this.httpClient.post<string>(environment.apiUrl + "/checkauth", {}).toPromise().catch(
      err => {
        console.log(err);
        return undefined;
      }
    );
  }

  public isAuthenticated(): Observable<boolean> {
    return this.authenticated$.asObservable();
  }

  public getUsername(): string{
    return this.username$.value;
  }

  public logout(): void {
    this.authenticated$.next(false);
    localStorage.removeItem(environment.sessionStorageKey)
  }
}
