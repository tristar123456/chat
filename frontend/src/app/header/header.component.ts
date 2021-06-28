import {AfterContentInit, AfterViewChecked, AfterViewInit, Component, EventEmitter, Input, OnInit} from '@angular/core';
import { Router } from "@angular/router";
import {ResizeService} from "../size-detector/resize.service";
import {SCREEN_SIZE} from "../size-detector/screen-size.enum";
import {AuthService} from "../auth/auth.service";
import {BackendService} from "../backend.service";
import {SearchService} from "../search.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, AfterViewInit {
  @Input() clickEvent: EventEmitter<boolean> | undefined;
  menuExpanded: boolean | undefined;
  size: number | undefined;

  username: string = '';

  constructor(
    private router: Router,
    private resizeService: ResizeService,
    private authService: AuthService,
    private searchService: SearchService
  ) {
  }

  ngOnInit(): void {
    this.menuExpanded = false;
    this.username = this.authService.getUsername()!;
  }

  ngAfterViewInit(): void {
    this.resizeService.onResize$.subscribe((size: SCREEN_SIZE) => {
      this.size = size;
      setTimeout( () => {
        this.menuExpanded = size > 2;
      });
    });
    this.clickEvent?.subscribe((bool: boolean) => {
      if (bool === true && this.size! < 3) {
        this.menuExpanded ? this.menuExpanded = false : null;
      }
    });
  }

  searchUser(search: string) {
    this.searchService.fetchList(search);
    this.router.navigate(["user"]);
  }
}
