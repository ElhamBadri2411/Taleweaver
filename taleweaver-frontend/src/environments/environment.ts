export const environment = {
  production: false,
  apiUrl: "http://localhost:3000/api/",
  clientId: '',
  redirectUri: window.location.origin,
  postLogoutRedirectUri: `${window.location.origin}/signin`,
  originLocation: window.location.origin
};
