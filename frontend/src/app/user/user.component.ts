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
  constructor(
    private backendService: BackendService,
    public searchService: SearchService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  openChat(username2: string) {
    this.backendService.addChat(username2).then(
      id => {
        if (id !== "") {
          this.router.navigate(["chat", id])
        }
      },
      err => console.log(err)
    );
  }
}
