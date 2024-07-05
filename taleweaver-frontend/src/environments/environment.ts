export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api/',
  wsUrl: 'http://localhost:1234',
  clientId: '',
  redirectUri: window.location.origin,
  postLogoutRedirectUri: `${window.location.origin}/signin`,
  originLocation: window.location.origin,
};
