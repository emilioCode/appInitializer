import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { resolve } from 'dns';
import { ConfigService } from './core/services/config.service';

const appInitializerFn = (appConfig: any) => {
  return () => {
    const promise = new Promise((resolve) => {
      appConfig.loadAppConfig().then(() => {
        resolve(appConfig.loadAppConfigExtend());
      });
    });
    return promise;
  };
};

const PROVIDERS: any = [
  ConfigService,
  {
    deps: [ConfigService],
    multi: true,
    provide: APP_INITIALIZER,
    useFactory: appInitializerFn,
  },
];

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, HttpClientModule],
  providers: PROVIDERS,
  bootstrap: [AppComponent],
})
export class AppModule {}
