import { autoinject } from 'aurelia-framework';
import { inject, NewInstance } from 'aurelia-dependency-injection';
import { DialogService, DialogController } from 'aurelia-dialog';
@autoinject
export class prompt {
  controller: any;
  mainComponent: any;

  constructor(private dialogController: DialogController) {

  }
  model: any = {};

  // eslint-disable-next-line @typescript-eslint/ban-types
  action?: (args?: any) => {}

  ok(): void {
    this.action('OK');
    this.dialogController.ok('OK');
  }
  activate(model) {
    this.model = model;
    this.action = model.action;
    this.mainComponent = model.mainComponent;
  }
}
