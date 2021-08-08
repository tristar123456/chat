import {Component, HostListener, OnInit} from '@angular/core';
import {BackendService} from "../backend.service";
import {Chat} from "../chat-detail/Chat";
import {pipe} from "rxjs";
import {ResizeService} from "../size-detector/resize.service";
import {SCREEN_SIZE} from "../size-detector/screen-size.enum";

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.scss']
})
export class ChatWindowComponent implements OnInit {

  @HostListener('document:click', ['$event'])
  documentClick(event: MouseEvent){
      if (!this.hideChats){
        if (!this.toggleLock){
          this.hideChats = true;
        }
      }
  }

  chats: Chat[] | undefined;
  username: string = "";
  chatId: string = "";
  hideChats = false;
  public toggleLock: boolean = false;

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
    }, 200);
    (this.resizeService.current!) >2 ? [this.hideChats, this.toggleLock] = [false, false] : [this.hideChats, this.toggleLock] = [true, true];
    this.resizeService.onResize$.subscribe( size => {

      size >2 ? this.hideChats = false : this.hideChats = true;
      size >2 ? this.toggleLock = false : this.toggleLock = true;
    });
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
