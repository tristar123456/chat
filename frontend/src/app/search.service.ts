import { Injectable } from '@angular/core';
import {BackendService} from "./backend.service";

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  public usernames: string[] = [""];

  constructor(
    private backendService: BackendService
  ) {
    this.fetchList("");
  }

  public fetchList(search: string): void{
    this.backendService.searchUser(search).then(
      usernames => {
        this.usernames = usernames.filter((val)=> val !== this.backendService.getUsername());
        this.usernames = this.usernames.sort();
      }
    ).catch( () => this.usernames = []);
  }

}
