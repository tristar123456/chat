import { Pipe, PipeTransform } from '@angular/core';
import {Chat} from "../chat-detail/Chat";

@Pipe({
  name: 'chatUsername'
})
export class ChatUsernamePipe implements PipeTransform {

  transform( chats: Chat[],username: string): string[] {
    return chats.map<string>((chat) => {
      return username===chat.username1?
        (chat.username2===""?"none":chat.username2):
        (chat.username1===""?"none":chat.username1)
    }).sort();
  }


}
