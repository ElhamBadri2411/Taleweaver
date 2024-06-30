import { Injectable } from '@angular/core';
import { OAuthService, AuthConfig } from 'angular-oauth2-oidc';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

const oAuthConfig: AuthConfig = {
  issuer: 'https://accounts.google.com',
  strictDiscoveryDocumentValidation: false,
  redirectUri: environment.redirectUri,
  clientId: environment.clientId,
  scope: 'openid profile email',
  postLogoutRedirectUri: environment.postLogoutRedirectUri,
};

@Injectable({
  providedIn: 'root',
})
export class GoogleApiService {
  constructor(
    private readonly oAuthService: OAuthService,
    private router: Router,
  ) {
    oAuthService.configure(oAuthConfig);
    //Need to change this line when not running app on local host
    oAuthService.logoutUrl =
      'https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout?continue=' +
      environment.originLocation +
      '/signin';
    oAuthService.loadDiscoveryDocument().then(() => {
      // // This method just tries to parse the token(s) within the url when
      // // the auth-server redirects the user back to the web-app
      // // It doesn't send the user the the login page
      oAuthService.tryLoginImplicitFlow().then(() => {
        // when not logged in, redirecvt to google for login
        // else load user profile
        if (!oAuthService.hasValidAccessToken()) {
          //oAuthService.initLoginFlow()
          //Im not sure but this process might be unsafe, im just redirecting them if they try to go to anything else
          //hopefully wont cause any security issues
          // this.router.navigate(['/signin']);
        } else {
          oAuthService.loadUserProfile().then((userProfile) => {
            //this.userProfileSubject.next(userProfile as UserInfo)
            console.log(JSON.stringify(userProfile));
          });
        }
      });
    });
  }
  signIn() {
    this.oAuthService.initLoginFlow();
  }

  signOut() {
    this.oAuthService.logOut();
    //this.router.navigate(['/signin']);
  }

  isLoggedIn(): boolean {
    return this.oAuthService.hasValidAccessToken();
  }
}
