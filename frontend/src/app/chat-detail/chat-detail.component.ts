import { Component, OnInit } from '@angular/core';
import {BackendService} from "../backend.service";
import {ActivatedRoute} from "@angular/router";
import {Chat} from "./Chat";
import {Message} from "./Message";

@Component({
  selector: 'app-chat-detail',
  templateUrl: './chat-detail.component.html',
  styleUrls: ['./chat-detail.component.scss']
})
export class ChatDetailComponent implements OnInit {
  chatId: string|undefined;
  username2: string | undefined;
  messages: Message[] = {} as Message[];

  constructor(
    private backendService: BackendService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.username2 = params.id;
      this.getChat(params.id);
      this.backendService.getChats().then((chats)=>{
        chats.forEach((chat)=>{
          if (chat.username1==params.id || chat.username2==params.id){
            this.chatId = chat.id;
          }
        })
      })
    });
  }

  private getChat(username2: string): void{
    this.backendService.getChat((username2==="none"? "" : username2!)).then( messages =>{
      this.messages = messages;
    });
  }

  sendMessage($event: any) {
    const msgText = $event.target.value;
    this.backendService.sendMsg(this.chatId!, msgText).then(
      () => {
        $event.target.value = "";
        this.getChat((this.username2 === "none" ? "" : this.username2!));
      }
    );
  }

  getAllMessages(): Message[] {
    return this.messages;
  }
}
