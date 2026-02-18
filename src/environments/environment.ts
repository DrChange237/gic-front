// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  API_URL: 'https://light-beds-drop.loca.lt/api',
  // API_URL_DEV: 'https://developer.ccabank-app.com/sandbox/api',
  API_URL_DEV: 'http://localhost:2026/api',
  API_URL_TEST: 'https://applications-dev.cca.ad/api',
  APP_NAME: 'Global Immigration Canada',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
