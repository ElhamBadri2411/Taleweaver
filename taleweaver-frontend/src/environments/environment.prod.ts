export const environment = {
  production: true,
  apiUrl: 'https://api.taleweaver.me/api/',
  wsUrl: 'wss://api.taleweaver.me/',
  clientId: '232201998992-q14m6e4ptncjclv72qi0rg23semeiv8h.apps.googleusercontent.com',
  redirectUri: window.location.origin,
  postLogoutRedirectUri: `${window.location.origin}/signin`,
  originLocation: window.location.origin,
};
