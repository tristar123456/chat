import {Component, OnInit} from '@angular/core';
import {BackendService} from "../backend.service";
import {Chat} from "../chat-detail/Chat";

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.css']
})
export class ChatWindowComponent implements OnInit {
  chats: Chat[] | undefined;
  username: string| undefined;

  constructor(
    private backendService: BackendService
  ) {
  }

  ngOnInit(): void {
    this.username = this.backendService.getUsername();
    this.chats = [] as Chat[];
    this.getChats();
  }

  async getChats(): Promise<void>{
    this.chats = await this.backendService.getChats();
  }

}
