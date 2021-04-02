import { asset } from './components/asset';
import { Aurelia } from 'aurelia-framework';
import * as environment from '../config/environment.json';
import { PLATFORM } from 'aurelia-pal';
import 'bootstrap/dist/css/bootstrap.css';
import { TCustomAttribute, Backend } from 'aurelia-i18n';
import { } from 'i18next-http-backend';
import i18next from 'i18next';
import { readdirSync, lstatSync } from 'node:fs';
import { join } from 'node:path';
import { Console } from 'node:console';
import XHR from 'i18next-xhr-backend';
import { HttpClient } from 'aurelia-fetch-client';


export function configure(aurelia: Aurelia): void {


  aurelia.use
    .standardConfiguration()
    .feature(PLATFORM.moduleName('resources/index'))
    .plugin(PLATFORM.moduleName('aurelia-validation'))
    .plugin(PLATFORM.moduleName('aurelia-dialog')
      , config => {
        config.settings.centerHorizontalOnly = true;
      }
    )
    .plugin(PLATFORM.moduleName('aurelia-i18n'), (instance) => {
      const aliases = ['t', 'i18n'];
      TCustomAttribute.configureAliases(aliases);
      instance.i18next.use(XHR);
      instance.i18next.use(Cache);
      const options = {
        lng: 'en',
        attributes: aliases,
        fallbackLng: 'en',
        debug: false,
        ns: ['translation'],
        defaultNs: 'translation'
        , backend: {
          loadPath: '/locales/{{lng}}/{{ns}}.json',
          responseType : 'json'
        }
      };
      instance.i18next.init(options, (err, t) => {
        if (err) return console.log('something went wrong loading', err);
      }).then(function (t) {
        instance.i18next.reloadResources(['en'])
          
      });
      return instance.setup(options);
    })
    .eventAggregator()
    .defaultBindingLanguage()
    .defaultResources()
    ;

  aurelia.use.developmentLogging(environment.debug ? 'debug' : 'warn');

  if (environment.testing) {
    aurelia.use.plugin(PLATFORM.moduleName('aurelia-testing'));
  }

  const httpClient = new HttpClient();
  
  ////todo add some config to http events
  // httpClient.configure(x => {
  //     x.withInterceptor({
  //       request(message) {
  //         return message;
  //       },
  
  //       requestError(error) {
  //         console.info('requeust has some eror')
  //         throw error;
  //       },
  
  //       response(message) {
  //         console.info('server responded')
  //         return message;
  //       },
  
  //       responseError(error) {
  //         console.info('server failed to responding')
  //         throw error;
  //       }
  //     });
  //   });
  

  
  aurelia.start().then(() => aurelia.setRoot(PLATFORM.moduleName('app')));
}

