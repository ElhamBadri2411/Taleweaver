import { Injectable } from '@angular/core';
import { OAuthService, AuthConfig } from 'angular-oauth2-oidc';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { NavigationEnd } from '@angular/router';
import { filter, take } from 'rxjs/operators';



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

  constructor(private readonly oAuthService: OAuthService, private router: Router) {
    oAuthService.configure(oAuthConfig)
    oAuthService.logoutUrl="https://www.google.com/accounts/Logout";
    oAuthService.loadDiscoveryDocument().then( () => {

      // Redirect to dashboard upon successful login
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd),
        take(1)
      ).subscribe(() => {
        if (this.oAuthService.hasValidAccessToken()) {
          this.router.navigate(['/dashboard']);
        }
      });

      // This method just tries to parse the token(s) within the url when
      // the auth-server redirects the user back to the web-app
      // It doesn't send the user the the login page
      oAuthService.tryLoginImplicitFlow().then( () => {
        // when not logged in, redirecvt to google for login
        // else load user profile
        if (!oAuthService.hasValidAccessToken()) {
          //oAuthService.initLoginFlow()
          //Im not sure but this process might be unsafe, im just redirecting them if they try to go to anything else
          //hopefully wont cause any security issues
        } else {
          oAuthService.loadUserProfile().then((userProfile) => {
            //this.userProfileSubject.next(userProfile as UserInfo)
            console.log(JSON.stringify(userProfile));
          });
        }
      })
    });
  }

  signIn() {
    this.oAuthService.initLoginFlow();
  }

  signOut() {
    this.oAuthService.logOut(true);
    this.router.navigate(['/']);
  }

  isLoggedIn(): boolean {
    return this.oAuthService.hasValidAccessToken();
  }
}
