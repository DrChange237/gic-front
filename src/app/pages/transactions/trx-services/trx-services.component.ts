import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { SharedComponentsModule } from "src/app/shared/components/shared-components.module";
import {FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {NgbDateAdapter, NgbInputDatepicker, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {NgSelectModule} from "@ng-select/ng-select";
import {TranslatePipe} from "@ngx-translate/core";
import {CurrencyPipe, formatDate, NgClass} from "@angular/common";
//
import {WizardComponent} from "../../../shared/components/form-wizard/wizard/wizard.component";
import {FormWizardModule} from "../../../shared/components/form-wizard/form-wizard.module";
import {FactoryService} from "../../../core/services/factory.service";
import {InitPaymentResponse, ServiceModel, ServiceType} from "../../../shared/interfaces";
import {CommonService} from "../../../core/services/common.service";
import {CustomDateAdapter} from "../../../core/utils/date-picker/custom-date-adapter";
import {
  ConfirmActionModalComponent
} from "../../../shared/components/confirm-action-modal/confirm-action-modal.component";
import {ActionResultModalComponent} from "../../../shared/components/action-result-modal/action-result-modal.component";
import {SharedPipesModule} from "../../../shared/pipes/shared-pipes.module";

@Component({
  selector: 'app-trx-services',
  templateUrl: './trx-services.component.html',
  styleUrls: ['./trx-services.component.scss'],
  imports: [SharedComponentsModule, FormWizardModule, FormsModule, ReactiveFormsModule,
    TranslatePipe, NgSelectModule, NgbInputDatepicker, NgClass, CurrencyPipe, SharedPipesModule],
  standalone: true,
  providers: [{ provide: NgbDateAdapter, useClass: CustomDateAdapter }]
})
export class TrxServicesComponent implements OnInit {
  @ViewChild(WizardComponent) wizard!: WizardComponent;

  isSubmitted: boolean;
  isFormCompleted: boolean = false;

  servicesType$: ServiceType[] = [];
  services$: ServiceModel[] = [];
  currService: ServiceModel;

  sizeOfForm: number = 0;
  safeInstructions: SafeHtml = '';
  serviceForm: UntypedFormGroup;
  optionPayment: { label: string, amount: number, id: string, description: string };

  paymentInitiate: InitPaymentResponse;

  constructor(
      private modalService: NgbModal,
      private fb: UntypedFormBuilder,
      private commonSrv: CommonService,
      private factorySrv: FactoryService,
      private sanitizer: DomSanitizer,
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
    this.currService = service;
    this.addStyleOnInstruction(service.instructions);
    this.isFormCompleted = false;
    this.paymentInitiate = null;

    this.buildForm(service);

    this.wizard.next();
  }

  initPayment() {
    this.isSubmitted = true;

    if (this.serviceForm.invalid) {
      return this.commonSrv.alert('warning', 'form.required_fields', 'transactions.service');
    }

    const formData = this.serviceForm.getRawValue();
    const form = this.currService.withForm
        ? this.currService.initForm.formItems.map(item => ({
            id: item.id, name: item.name, value: formData[item.name]
          }))
        : [];
    const data = {
      service: this.currService.code,
      reference: formData['reference'] + '' || '',
      amount: +(formData['amount'] || 0),
      form
    }

    this.factorySrv.initPayment(data).subscribe({
      next: res => {
        this.paymentInitiate = res
        if (!this.currService.withOptions) {
          this.isFormCompleted = true;
          this.wizard.next();
        }
      },
      error: err => this.commonSrv.errorHandle(err, 'transactions.init_payment_failed', 'transactions.payment_service')
    });
    this.isSubmitted = false;
  }

  choosePaymentOption() {
    if (!this.optionPayment) {
      return this.commonSrv.alert('warning', 'form.required_fields', 'transactions.service');
    }

    const data = {
      id: this.paymentInitiate.id,
      amount: this.optionPayment.amount,
      optionId: this.optionPayment.id
    }

    this.factorySrv.selectOptionPayment(data).subscribe({
      next: res => {
        this.paymentInitiate = res
        this.isFormCompleted = true;
        this.wizard.next();
      },
      error: err => this.commonSrv.errorHandle(err, 'transactions.choose_payment_option_failed', 'transactions.payment_service')
    });
  }

  openConfirmModal() {
    const modalRef = this.modalService.open(ConfirmActionModalComponent, {
      centered: true, backdrop: 'static',
    });

    modalRef.componentInstance.title = this.currService?.name;
    modalRef.componentInstance.message = 'modal.confirm_payment_service';
    modalRef.componentInstance.requirePin = false;

    modalRef.result.then((res: string) => res && this.confirmPayment(res));
  }

  confirmPayment(code: string) {
    const data = {
      id: this.paymentInitiate.id,
      password: this.commonSrv.secureSrv.hashMD5(code)
    };

    this.factorySrv.confirmPayment(data).subscribe({
      next: () => {
        const resultModal = this.modalService.open(ActionResultModalComponent, {
          centered: true, backdrop: 'static',
        });

        resultModal.componentInstance.title = 'transactions.payment_service';
        resultModal.componentInstance.message = 'transactions.payment_successful';
        resultModal.componentInstance.actionButtonText = 'btn.download_receipt';
        resultModal.componentInstance.closeButtonText = 'btn.go_to_history';
        resultModal.componentInstance.isSuccess = true;

        resultModal.result.then(res => {
          if (res) { this.downloadReceipt() }
          this.commonSrv.router.navigateByUrl('transactions/history/agent')
        });
      },
      error: err => this.commonSrv.errorHandle(err, 'transactions.confirm_payment_failed', 'transactions.payment_service')
    });
  }

  downloadReceipt() {
    this.factorySrv.downloadReceipt(this.paymentInitiate.id).subscribe({
      next: res => {
        const name = this.paymentInitiate.service.name + '-' + formatDate(new Date(), 'yyyy-MM-dd_HH-mm', 'fr-FR');
        this.commonSrv.openFileOnBlank(res, true, `'cca-receipt-${name}.pdf`)
      },
      error: err => this.commonSrv.errorHandle(err, 'transactions.choose_payment_option_failed', 'transactions.payment_service')
    });
  }

  onConfirmStep() {
    this.wizard.complete();
  }

  openModal(content: TemplateRef<never>) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true });
  }

  get isOddForm(): boolean {
    return this.sizeOfForm % 2 !== 0;
  }

  get sf() {
    return this.serviceForm.controls;
  }

  private buildForm(service: ServiceModel) {
    const group: any = {}
    this.sizeOfForm = 0;
    this.isSubmitted = false;

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

    this.serviceForm = this.fb.group(group);
  }

  private addStyleOnInstruction(htmlContent: string) {
    if (!htmlContent) return;

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;

    tempDiv.querySelectorAll('ol').forEach((el) => {
      el.classList.add('list-group');
    });
    tempDiv.querySelectorAll('ul').forEach((el) => {
      el.classList.add('list-group');
    });
    tempDiv.querySelectorAll('li').forEach((el) => {
      el.classList.add('list-group-item');
    });
    tempDiv.querySelectorAll('img').forEach((el) => {
      el.classList.add('rounded-md', 'shadow', 'my-4');
    });

    this.safeInstructions = this.sanitizer.bypassSecurityTrustHtml(tempDiv.innerHTML);
  }
}
