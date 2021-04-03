import { AssetViewModel } from './../interfaces/AssetViewModel';
import { type } from 'node:os';
import { EventAggregator } from 'aurelia-event-aggregator';
import { Rules, ValidationRules } from 'aurelia-validation';
import { inject, NewInstance } from 'aurelia-dependency-injection';
import { ValidationController, validateTrigger } from 'aurelia-validation';
import { BootstrapFormRenderer } from './BootstrapFormRenderer';
import { I18N } from 'aurelia-i18n';
import { DialogService, DialogController } from 'aurelia-dialog';
import { prompt } from './propmt';
import { Redirect, Router } from 'aurelia-router';
import { stringify } from 'node:querystring';
import { computedFrom, bindable } from 'aurelia-framework';
import { HttpClient, json } from 'aurelia-fetch-client';

@inject(
  NewInstance.of(ValidationController)
  , NewInstance.of(I18N)
  , NewInstance.of(EventAggregator)
  , NewInstance.of(DialogService)
  , NewInstance.of(ValidationRules)
  , (Router)
)
export class asset {
  [x: string]: any;
  controller = null;
  _Model: any = { "Department": "2" };
  countries = [];

  constructor(controller: any, i18n: any, ea: { subscribe: (arg0: string, arg1: (payload: any) => void) => void; }, dialogService: any, dialogController: any, router: any) {
    this.controller = controller;
    this.canSave = false;
    this.dialogService = dialogService;
    this.controller.addRenderer(new BootstrapFormRenderer());
    this.controller.validateTrigger = validateTrigger.changeOrBlur;
    this.i18n = i18n;
    this.router = router;
    ea.subscribe('i18n:locale:changed', (payload: any) => {
      this.i18n.updateTranslations(this.element);
    });
    this.initCountries();

    //ValidationRules.customRule('country', (value, obj) => value === null || value === undefined || value === 'aa', 'ridi');
    ValidationRules.ensure('assetName').minLength(5).required()
      .ensure('Department').required()
      .ensure('CountryofDepartment').required().satisfies((val, o: AssetViewModel, countries = this.countries) => {

        return countries.includes(o.CountryofDepartment);
      })
      .then()
      .withMessage("Country is not valid")
      .ensure('Department').required()
      .ensure('PurchaseDate').required().satisfies((val, o: AssetViewModel) => {

        const sourceDate = new Date(new Date().setFullYear(new Date().getFullYear() - 1));
        const result = new Date(o.PurchaseDate) > sourceDate;
        return result;
      })
      .then()
      .withMessage("PurchaseDate is not valid and is older one year old")
      .ensure('EMailAdressOfDepartment').required().satisfies((val, o: AssetViewModel) => {

        const regex = /.+@.+/g;
        let result = false;
        if (o.EMailAdressOfDepartment.match(regex)) {
          result = true;
        }
        return result;
      })
      .then().withMessage("Email is not match by valid topleveldomain rules")
      .on(this._Model);
    //*@*.
  }
  attached() {
    this.i18n.updateTranslations(this.element);
  }

  initCountries() {
    const httpClient = new HttpClient();
    httpClient.configure(config => {
      config
        .useStandardConfiguration()
        .withBaseUrl('api/')
        .withDefaults({
          credentials: 'same-origin',
        })
        .withInterceptor({
          request(request) {
            return request;
          }
        });
    });
    httpClient.fetch('https://restcountries.eu/rest/v2/').then(response =>
      response.json()
    )
      .then(data => {
        data.forEach(element => {
          this.countries.push(element.name);
        });      

      }).catch(error => {
        console.error(error);
      });
  }
  submit() {
    this.controller.validate();
    if (!this.controller.errors) {
      console.error('Form Data is invalid.');
    } else {
      this.request();
    }
  }
  request() {
    const httpClient = new HttpClient();

    httpClient.fetch('http://localhost:5000/Asset', {
      method: 'post',
      body: json( this._Model)
    })
      .then(response =>
        response.json()
      )
      .then(data => {
        console.log(data);
        this.router.navigateToRoute('confirm');
      }).catch(error => {
        this.dialogService.open({ viewModel: prompt, model: { "title": "Error", "message": error, action: this.infoPrompt,mainComponent: this }, lock: false });
        console.error(error);
      });




  }


  resetConfirmAction(args: any): void {
    console.info('OK button pressed', args);
    if (args === 'OK') {
      this.mainComponent._Model =  { "Department": "2" };
    }
  }


  infoPrompt(args: any): void {
    console.info('OK button pressed', args);
  }

  reset() {

    this.dialogService.open({ viewModel: prompt, model: { "title": "Are you sure?", "message": "After confirm this question, reset all the data will do.", mainComponent: this, action: this.resetConfirmAction }, lock: false })
      .then((result: any) => {
        console.log(result);

      });
  }

  @computedFrom('_Model.assetName', '_Model.Department', '_Model.CountryofDepartment', '_Model.PurchaseDate', '_Model.EMailAdressOfDepartment')
  get isResetable() {
    const assetName = this._Model.assetName;
    const Department = this._Model.Department;
    const CountryofDepartment = this._Model.CountryofDepartment;
    const PurchaseDate = this._Model.PurchaseDate;
    const EMailAdressOfDepartment = this._Model.EMailAdressOfDepartment;
    const _isValid = assetName || Department || CountryofDepartment || PurchaseDate || EMailAdressOfDepartment;
    return (_isValid);
  }

  @computedFrom('_Model.assetName', '_Model.Department', '_Model.CountryofDepartment', '_Model.PurchaseDate', '_Model.EMailAdressOfDepartment')
  get isValid() {
    const assetName = this._Model.assetName;
    const Department = this._Model.Department;
    const CountryofDepartment = this._Model.CountryofDepartment;
    const PurchaseDate = this._Model.PurchaseDate;
    const EMailAdressOfDepartment = this._Model.EMailAdressOfDepartment;
    // const broken = this._Model.broken;
    let hasError = true;
    if (!this.controller.errors) {
      hasError = false;
    }
    else if (this.controller.errors.length < 1) {
      hasError = false;
    }
    console.info('hasError', hasError);

    const _isValid = assetName && Department && CountryofDepartment && PurchaseDate && EMailAdressOfDepartment && (!hasError)
    return (_isValid);
  }


}









