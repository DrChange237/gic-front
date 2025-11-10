import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { SharedComponentsModule } from "src/app/shared/components/shared-components.module";
import {FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {FormWizardModule} from "../../../shared/components/form-wizard/form-wizard.module";
import {TranslatePipe} from "@ngx-translate/core";
import {FactoryService} from "../../../core/services/factory.service";
import {ServiceModel, ServiceType} from "../../../shared/interfaces";
import {CommonService} from "../../../core/services/common.service";
import {BaseApiService} from "../../../core/services/base-api.service";
import {WizardComponent} from "../../../shared/components/form-wizard/wizard/wizard.component";
import {NgSelectModule} from "@ng-select/ng-select";
import {NgbInputDatepicker, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-trx-services',
  templateUrl: './trx-services.component.html',
  styleUrls: ['./trx-services.component.scss'],
  imports: [SharedComponentsModule, FormWizardModule, FormsModule, ReactiveFormsModule, TranslatePipe, NgSelectModule, NgbInputDatepicker, NgClass],
  standalone: true,
})
export class TrxServicesComponent implements OnInit {
  @ViewChild(WizardComponent) wizard!: WizardComponent;

  isCompleted: boolean;

  imageBaseUrl: string = this.baseSrv.resolveImgUrl() + '/files/';
  servicesType$: ServiceType[] = [];
  services$: ServiceModel[] = [];
  currService: ServiceModel;

  sizeOfForm: number = 0;
  loadingForm: boolean = false;
  serviceForm: UntypedFormGroup;

  constructor(
      private modalService: NgbModal,
      private baseSrv: BaseApiService,
      private fb: UntypedFormBuilder,
      private commonSrv: CommonService,
      private factorySrv: FactoryService,
  ) { }

  ngOnInit() {
    this.loadServicesType();
  }

  loadServicesType() {
    this.factorySrv.getServiceTypes().subscribe({
      next: res => { this.servicesType$ = res; },
      error: err => this.commonSrv.errorHandle(err, 'transactions.get_service_types_failed', 'transactions.service')
    });
  }

  loadServices(code: string) {
    this.factorySrv.getServices(code).subscribe({
      next: res => {
        this.services$ = res;
        this.wizard.next();
      },
      error: err => this.commonSrv.errorHandle(err, 'transactions.get_service_failed', 'transactions.service')
    });
  }

  initializeForm(service: ServiceModel) {
    console.log(service)
    this.currService = service;
    this.buildForm(service);

    this.wizard.next();
  }

  initPayment() {
    this.wizard.next();
  }

  onStep1Next(e) {}

  onStep2Next(e) {}

  onStep3Next(e) {}

  onComplete(e) {}

  buildForm(service: ServiceModel) {
    const group: any = {}
    this.sizeOfForm = 0;

    if (service.withRef) {
      const validators = service.regex ? [Validators.pattern(service.regex)] : [];
      group['reference'] = ['', [Validators.required, ...validators]];
      this.sizeOfForm++;
    }

    if (service.withAmount) {
      group['amount'] = [0, Validators.required];
      this.sizeOfForm++;
    }

    if (service.withForm && service.initForm?.formItems) {
      service.initForm.formItems
          .sort((a, b) => a.position - b.position)
          .forEach(item => {
            const validators = [];
            if (item.required) validators.push(Validators.required);
            if (item.regex) validators.push(Validators.pattern(item.regex));
            group[item.name] = ['', validators];
            this.sizeOfForm++;
          });
    }

    console.log(this.sizeOfForm)
    this.serviceForm = this.fb.group(group);
  }

  openModal(content: TemplateRef<never>) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true });
  }

  get isOddForm(): boolean {
    return this.sizeOfForm % 2 !== 0;
  }
}
