import { registerLocaleData } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import ptBr from '@angular/common/locales/pt';
import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom, isDevMode, LOCALE_ID } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideRouterStore, routerReducer } from '@ngrx/router-store';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';

import { environment as env } from './../environments/environment';
import { routes } from './app.routes';
import { SharedModule } from './shared/shared.module';
import { coreEffects, coreReducers } from './store/core';
import { messagesEffects, messagesReducers } from './store/messages';
import { metaReducers } from './store/meta-reducers';
import { CustomRouterStateSerializer } from './store/router';
import { settingsEffects, settingsReducers } from './store/settings';

registerLocaleData(ptBr, 'pt');

const { auth, app } = env;

const initializeKeycloak = (keycloak: KeycloakService) => {
  return () =>
    keycloak.init({
      config: {
        url: auth.url,
        realm: auth.realm,
        clientId: auth.clientId
      },
      initOptions: {
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html'
      },
      bearerExcludedUrls: ['/assets']
    });
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideStore({
      core: coreReducers,
      messages: messagesReducers,
      settings: settingsReducers,
      router: routerReducer
    }, { metaReducers }),
    provideRouterStore({
      serializer: CustomRouterStateSerializer
    }),
    provideEffects([
      coreEffects,
      messagesEffects,
      settingsEffects,
    ]),
    provideStoreDevtools({
      maxAge: 25, // Retains last 25 states
      logOnly: !isDevMode(), // Restrict extension to log-only mode
      autoPause: true, // Pauses recording actions and state changes when the extension window is not open
      trace: false, //  If set to true, will include stack trace for every dispatched action, so you can see it in trace tab jumping directly to that part of code
      traceLimit: 75, // maximum stack trace frames to be stored (in case trace option was provided as true)
    }),
    importProvidersFrom(
      KeycloakAngularModule,
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: (http: HttpClient) => new TranslateHttpLoader(http, `${app.i18nPrefix}/assets/i18n/`, '.json'),
          deps: [HttpClient]
        }
      }),
      SharedModule
    ),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService]
    },
    { provide: LOCALE_ID, useValue: 'pt' }
  ]
};
