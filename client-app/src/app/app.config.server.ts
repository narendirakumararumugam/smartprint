import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';
import { LOCAL_STORAGE } from './tokens';
import { withInterceptors, provideHttpClient, withFetch } from '@angular/common/http';
import { httpInterceptor } from './core/interceptors/http.interceptor';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    {provide: LOCAL_STORAGE,
      useFactory: () => ({
        getItem: () => {},
        setItemItem: () => {},
        removeItem: () => {}
      })
    }
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
