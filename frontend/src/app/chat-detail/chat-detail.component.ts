import { Component, OnInit } from '@angular/core';
import {BackendService} from "../backend.service";
import {ActivatedRoute} from "@angular/router";
import {Chat} from "./Chat";
import {Message} from "./Message";

@Component({
  selector: 'app-chat-detail',
  templateUrl: './chat-detail.component.html',
  styleUrls: ['./chat-detail.component.css']
})
export class ChatDetailComponent implements OnInit {
  chat_id: string | undefined;
  messages: Message[] = {} as Message[];

  constructor(
    private backendService: BackendService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.chat_id = params.id;
      this.getChat(params.id);
    });
  }

  private getChat(id: string): void{
    this.backendService.getChat(id).then( messages =>{
      this.messages = messages;
    });
  }

  sendMessage($event: any) {
    const msgText = $event.target.value;
    this.backendService.sendMsg(this.chat_id!, msgText).then(
      () => this.getChat(this.chat_id!)
    );
  }

  getAllMessages(): Message[] {
    return this.messages;
  }
}
