import {Component, OnInit} from '@angular/core';
import {BackendService} from "../backend.service";
import {Router} from "@angular/router";
import {SearchService} from "../search.service";
import {pipe} from "rxjs";
import {ChatUsernamePipe} from "../chat-window/chat-username.pipe";
import {Chat} from "../chat-detail/Chat";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  username: string | undefined;
  usernames: string[] = [];
  friends: string[] = [];

  constructor(
    private backendService: BackendService,
    private searchService: SearchService,
    private router: Router,
    private chatUsernamePipe: ChatUsernamePipe
  ) {
  }

  ngOnInit(): void {
    this.username = this.backendService.getUsername();
    this.searchService.usernames.subscribe((usernames) => {
      // Get Friends
      this.backendService.getChats().then((chats: Chat[]) => {
          this.friends = this.chatUsernamePipe.transform(chats, this.username ?? "").filter((friendName)=>{
            return usernames.find(name => friendName === name);
          });
          this.usernames = usernames.filter((username) => !this.friends.find(friendName=> friendName === username));
        },
        (err) => {
          console.log(err);
        });
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
