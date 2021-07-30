import { Component, OnInit } from '@angular/core';
import {BackendService} from "../backend.service";
import {Router} from "@angular/router";
import {AuthService} from "../auth/auth.service";
import {FormControl, Validators} from "@angular/forms";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  loginFailed:boolean = false;

  public email = new FormControl('', [Validators.required, Validators.email]);
  public username = new FormControl('', [Validators.required]);
  public password = new FormControl('', [Validators.required]);


  constructor(
    private backendService: BackendService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  addUser() {
    this.backendService.addUser(this.username.value, this.password.value).then(()=>{
      this.authService.login(this.username.value, this.password.value);
    }).catch(error=>{
      if (error.status === 409){
        this.loginFailed = true;
      }
    });
  }
}
