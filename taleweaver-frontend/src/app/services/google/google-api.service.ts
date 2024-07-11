import { Injectable } from '@angular/core';
import { OAuthService, AuthConfig } from 'angular-oauth2-oidc';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { NavigationEnd } from '@angular/router';
import { filter, take } from 'rxjs/operators';
import { UserService } from '../user.service';

@Injectable({
  providedIn: 'root',
})
export class GoogleApiService {
  constructor(
    private readonly oAuthService: OAuthService, 
    private router: Router,
    private userService: UserService
  ) { 
    console.log('Google API Service Initialized');
    this.initConfigurations();
  }

  initConfigurations() {
    const oAuthConfig: AuthConfig = {
      issuer: 'https://accounts.google.com',
      strictDiscoveryDocumentValidation: false,
      clientId: environment.clientId,
      scope: 'openid profile email',
      redirectUri: environment.redirectUri,
      postLogoutRedirectUri: environment.postLogoutRedirectUri,
      showDebugInformation: true,
    };
    this.oAuthService.configure(oAuthConfig);
    // this.oAuthService.setupAutomaticSilentRefresh();
    this.oAuthService.loadDiscoveryDocumentAndTryLogin().then(() => {
      if (this.oAuthService.hasValidAccessToken()) {
        this.router.events.pipe(
          filter(event => event instanceof NavigationEnd),
          take(1)
        ).subscribe(() => {
          if (this.oAuthService.hasValidAccessToken()) {
            const idToken = this.oAuthService.getIdToken();
            this.userService.createUser(idToken).subscribe(
              (token) => {
                localStorage.setItem('token', token);
                console.log('User created:', token);
                this.router.navigate(['/dashboard']);
              },
              (error: any) => {
                console.error('Error creating user:', error);
              },
            );
          } 
        });
      }
    });
  }

  signIn() {
    this.oAuthService.initLoginFlow();
  }

  signOut() {
    this.oAuthService.revokeTokenAndLogout();
    this.oAuthService.logOut(true);
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }

  isLoggedIn(): boolean {
    return this.oAuthService.hasValidAccessToken() && this.oAuthService.hasValidIdToken();
  }

  getUserId(): string {
    return this.oAuthService.getIdentityClaims()['sub'];
  }
}
