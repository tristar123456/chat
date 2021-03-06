import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthService} from "./auth.service";

const LOGIN_URL = '/login';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  private authenticated: boolean| undefined;

  constructor(private authService: AuthService,
              private router: Router) {
    this.authService.isAuthenticated().subscribe((auth)=>{
      this.authenticated=auth;
    });
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    setTimeout(()=>{
      if (!!this.authenticated) {
        this.router.navigateByUrl(state.url);
      } else {
        this.router.navigateByUrl(LOGIN_URL);
      }
    },200)
    return !!this.authenticated;
  }

}
