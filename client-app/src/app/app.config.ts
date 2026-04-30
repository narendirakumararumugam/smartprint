import { ApplicationConfig, PLATFORM_ID } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { LOCAL_STORAGE } from './tokens';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { httpInterceptor } from './core/interceptors/http.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([httpInterceptor]), withFetch()),
    provideRouter(routes),
    provideClientHydration(),
    {
      provide: LOCAL_STORAGE,
      useFactory: (platformId: Object) => {
        if (isPlatformServer(platformId)) {
          return {};
        }
        return localStorage;
      },
      deps: [PLATFORM_ID],
    },
  ],
};
