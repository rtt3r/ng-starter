// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  debug: true,
  app: {
    name: 'NG Starter',
    i18nPrefix: '',
  },
  auth: {
    url: 'http://host.docker.internal:8081',
    realm: 'goal',
    clientId: 'core-ui'
  },
  goalAPI: {
    url: 'https://localhost:4432'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
