import { Component, OnInit } from '@angular/core';
import {BackendService} from "../backend.service";
import {Router} from "@angular/router";
import {AuthService} from "../auth/auth.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  loginFailed:boolean = false;

  constructor(
    private backendService: BackendService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  addUser(username: string, password: string) {
    this.backendService.addUser(username, password).then(()=>{
      this.authService.login(username, password);
    }).catch(error=>{
      if (error.status === 409){
        this.loginFailed = true;
      }
    });
  }
}
