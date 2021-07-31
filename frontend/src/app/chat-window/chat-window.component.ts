import {Component, OnInit} from '@angular/core';
import {BackendService} from "../backend.service";
import {Chat} from "../chat-detail/Chat";
import {pipe} from "rxjs";
import {ResizeService} from "../size-detector/resize.service";

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.scss']
})
export class ChatWindowComponent implements OnInit {
  chats: Chat[] | undefined;
  username: string = "";
  chatId: string = "";

  constructor(
    private backendService: BackendService,
    private resizeService: ResizeService
  ) {
  }

  ngOnInit(): void {
    setTimeout(()=>{
      this.username = this.backendService.getUsername();
      this.chats = [] as Chat[];
      this.getChats();
    }, 200)
  }

  private getChats(): void{
    this.backendService.getChats().then((chats)=>{
      this.chats = chats;
    },
      (err)=>{
      console.log(err);
      });
  }

}
