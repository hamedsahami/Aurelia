import { autoinject } from 'aurelia-framework';
import { PLATFORM } from 'aurelia-pal';
import { I18N } from 'aurelia-i18n';
import { EventAggregator } from 'aurelia-event-aggregator';
import { Router } from 'aurelia-router';
@autoinject
export class app {
  public message = '';
  static inject = [I18N, Element, EventAggregator, Router];
  i18n: any;
  element: any;
  currentLocale: any;
  router: any;

  constructor(i18n, element, ea, router) {
    this.i18n = i18n;
    this.element = element;
    this.router = router;
    this.currentLocale = this.i18n.getLocale();
    ea.subscribe('i18n:locale:changed', payload => {
      this.i18n.updateTranslations(this.element);
    });
  }
  attached() { // <--------- 5
    this.i18n.updateTranslations(this.element);
  }

  configureRouter(config, router) {
   
    config.title = 'Hahn Technical Task';
    config.map([
      { route: 'confirm', name: 'confirm', moduleId: PLATFORM.moduleName('./components/confirm'), nav: false, title: 'Confirm'  },
      { route: ['', 'asset'], name: 'asset', moduleId: './components/asset', nav: true, title: 'Asset'  },
    ]);
    this.router = router;
    config.fallbackRoute('asset');
    config.mapUnknownRoutes('not-found');
  }
}
