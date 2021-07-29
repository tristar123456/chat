import { Component, OnInit } from '@angular/core';
import {BackendService} from "../backend.service";
import {Router} from "@angular/router";
import {SearchService} from "../search.service";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  username: string = "";
  usernames: string[] = [];

  constructor(
    private backendService: BackendService,
    private searchService: SearchService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.username = this.backendService.getUsername();
    this.searchService.usernames.subscribe((usernames) =>{
      this.usernames = usernames;
    })
  }

  openChat(username2: string) {
    this.backendService.addChat(username2).then(
      id => {
        if (id !== "") {
          this.router.navigate(["chat", username2]);
        }
      },
      err => console.log(err)
    );
  }
}
