import { I18N } from "aurelia-i18n";

export class Locales {
  static inject = [I18N];
  i18n: any;
  locales: { title: string; code: string; }[];
  currentLocale: any;
  constructor(i18n) {
    this.i18n = i18n;
     
    this.locales = [
      {
        title: "English",
        code: "en"
      },
      {
        title: "German",
        code: "de"
      }
    ]
    this.currentLocale = this.i18n.getLocale();
  
  }
  setLocale(locale) :void {
    const code = locale.code;
    if(this.currentLocale !== code) {
      this.i18n.setLocale(code);
      this.currentLocale = code;
    }
  }
}
