import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private oauthService: OAuthService) {}

  canActivate(
    route: ActivatedRouteSnapshot, 
    state: RouterStateSnapshot) {

      var hasIdToken = this.oauthService.hasValidIdToken();
      var hasAccessToken = this.oauthService.hasValidAccessToken();

      return (hasIdToken && hasAccessToken);
  }
}
