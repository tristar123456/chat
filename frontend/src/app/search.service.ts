import { Injectable } from '@angular/core';
import {BackendService} from "./backend.service";
import {AuthService} from "./auth/auth.service";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  public usernames = new BehaviorSubject<string[]>([]);
  private username:string|undefined = "";

  constructor(
    private backendService: BackendService,
    private authService: AuthService
  ) {
    this.authService.isAuthenticated().subscribe((auth)=>{
      if (auth){
        setTimeout(()=>{
          this.username = this.authService.getUsername();
          this.fetchList("");
        },200);
      }
    })
  }

  public fetchList(search: string): void{
    this.backendService.searchUser(search).then(
      usernames => {
        this.usernames.next( usernames.filter((val)=> val !== this.username).sort());
      }
    ).catch( () => this.usernames.next([]));
  }

}
