import {Component, OnInit} from '@angular/core';
import {AuthService} from "../auth/auth.service";
import {Router} from "@angular/router";
import {BehaviorSubject} from "rxjs";
import {FormControl, Validators} from "@angular/forms";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public loginStatus$ = new BehaviorSubject<boolean>(false);

  public username = new FormControl('', [Validators.required]);
  public password = new FormControl('', [Validators.required]);

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
  }

  ngOnInit(): void {
  }

  async doLogin() {
    await this.authService.login(this.username.value, this.password.value).then(() => {
      this.loginStatus$.next(true);
      console.log("YSEAS");
      this.router.navigate(["/chat"]);
    }, (error: string) => {
      this.loginStatus$.next(false);
    });
  }
}
