import { Component, OnInit } from '@angular/core';
import {BackendService} from "../backend.service";
import {ActivatedRoute} from "@angular/router";
import {Chat} from "./Chat";
import {Message} from "./Message";
import {FormControl, Validators} from "@angular/forms";

@Component({
  selector: 'app-chat-detail',
  templateUrl: './chat-detail.component.html',
  styleUrls: ['./chat-detail.component.scss']
})
export class ChatDetailComponent implements OnInit {
  chatId: string|undefined;
  username2: string | undefined;
  messages: Message[] | undefined;
  chatTextArea: FormControl = new FormControl('', [
    Validators.required
  ] );

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

  sendMessage() {
    if (this.chatTextArea.valid){
      const msgText = this.chatTextArea.value;
      this.backendService.sendMsg(this.chatId!, msgText).then(
        () => {
          this.chatTextArea.patchValue("");
          this.getChat((this.username2 === "none" ? "" : this.username2!));
        }
      );
    } else {
      setTimeout(()=>{
        this.chatTextArea.reset();
      },1)
    }
  }
}
