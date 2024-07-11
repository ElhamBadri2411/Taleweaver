export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api/',
  wsUrl: 'ws://localhost:1234',
  clientId: '232201998992-q14m6e4ptncjclv72qi0rg23semeiv8h.apps.googleusercontent.com',
  redirectUri: window.location.origin,
  postLogoutRedirectUri: `${window.location.origin}/signin`,
  originLocation: window.location.origin,
};
