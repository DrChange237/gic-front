import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { SharedComponentsModule } from "src/app/shared/components/shared-components.module";
import {FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {NgbDateAdapter, NgbDateStruct, NgbInputDatepicker, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {NgSelectModule} from "@ng-select/ng-select";
import {TranslatePipe} from "@ngx-translate/core";
import {CommonModule, formatDate} from "@angular/common";
//
import {WizardComponent} from "../../../shared/components/form-wizard/wizard/wizard.component";
import {FormWizardModule} from "../../../shared/components/form-wizard/form-wizard.module";
import {FactoryService} from "../../../core/services/factory.service";
import {AccountBalance, InitPaymentResponse, ModuleModel, ProcessModel, ProcessStartRequest, ServiceModel, ServiceType} from "../../../shared/interfaces";
import {CommonService} from "../../../core/services/common.service";
import {CustomDateAdapter} from "../../../core/utils/date-picker/custom-date-adapter";
import {
  ConfirmActionModalComponent
} from "../../../shared/components/confirm-action-modal/confirm-action-modal.component";
import {ActionResultModalComponent} from "../../../shared/components/action-result-modal/action-result-modal.component";
import {SharedPipesModule} from "../../../shared/pipes/shared-pipes.module";
import {AuthService} from "../../../core/services/auth.service";
import { MODULES_ICONS } from 'src/app/core/utils/icons/module';
import { PROCESS_ICONS } from 'src/app/core/utils/icons/process';
import { Form, FormResponse } from 'src/app/shared/interfaces/form.interface';

@Component({
  selector: 'app-trx-services',
  templateUrl: './trx-services.component.html',
  styleUrls: ['./trx-services.component.scss'],
  imports: [CommonModule, SharedComponentsModule, FormWizardModule, FormsModule, ReactiveFormsModule, TranslatePipe,
    NgSelectModule, NgbInputDatepicker, SharedPipesModule],
  standalone: true,
  providers: [{ provide: NgbDateAdapter, useClass: CustomDateAdapter }]
})
export class TrxServicesComponent implements OnInit {
  @ViewChild(WizardComponent) wizard!: WizardComponent;

  isSubmitted: boolean;
  isFormCompleted: boolean = false;

  servicesType$: ServiceType[] = [];
  services$: ServiceModel[] = [];
  processDefinition$: ProcessModel[] = [];
  processSelected:ProcessModel;
  processForm: Form;
  modules$: ModuleModel[] = [];
  currService: ServiceModel;

  balanceAccount: AccountBalance;

  sizeOfForm: number = 0;
  safeInstructions: SafeHtml = '';
  serviceForm: UntypedFormGroup;
  initForm: UntypedFormGroup;

  optionPayment: { label: string, amount: number, id: string, description: string };

  paymentInitiate: InitPaymentResponse;

  minDate = { year: 1900, month: 1, day: 1 };
  maxDate: NgbDateStruct;

  

  constructor(
      private modalService: NgbModal,
      private fb: UntypedFormBuilder,
      private commonSrv: CommonService,
      private factorySrv: FactoryService,
      private sanitizer: DomSanitizer,
      public authSrv: AuthService,
  ) {
    const today = new Date();
    this.maxDate = { year: today.getFullYear(), month: today.getMonth() + 1, day: today.getDate() };
  }

  ngOnInit() {
    this.loadModules();
  }

  moduleImage(key : string): string {
    return MODULES_ICONS[key] || 'assets/images/default.png';
  }

  processImage(key : string): string {
    return PROCESS_ICONS[key] || 'assets/images/default.png';
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

  loadForm(process: ProcessModel) {
    this.factorySrv.getInitForm(process.key).subscribe({
      next: res => {
        this.processForm = res.form;
        console.log(this.processForm);
        if(res.form){
           this.buildForm(res.form);
        }else{
           this.buildVoidForm();
        }
        this.processSelected = process;
        this.wizard.next();
      },
      error: err => this.commonSrv.errorHandle(err, 'transactions.get_service_failed', 'transactions.service')
    });
  }

  loadProcessDefinition(module : string) {
    this.factorySrv.getProcessDefinition(module).subscribe({
      next: res => {
        this.processDefinition$ = res;
        this.wizard.next();
      },
      error: err => this.commonSrv.errorHandle(err, 'transactions.get_service_failed', 'transactions.service')
    });
  }

  loadModules() {
    this.factorySrv.getModules().subscribe({
      next: res => {
        this.modules$ = res;
        //this.wizard.next();
      },
      error: err => this.commonSrv.errorHandle(err, 'transactions.get_service_failed', 'transactions.service')
    });
  }

  loadBalance(service: string) {
    this.factorySrv.getBalanceOperationAccount(this.authSrv.user?.agency?.code, service).subscribe({
      next: res => { this.balanceAccount = res },
      error: err => this.commonSrv.errorHandle(err, 'account.get_balance_trx_failed', 'transactions.service')
    });
  }

  initializeForm(service: ServiceModel) {
    /*this.currService = service;
    this.isFormCompleted = false;
    this.paymentInitiate = null;

    this.addStyleOnInstruction(service.instructions);
    if (this.authSrv.isBankUser) { this.loadBalance(service.code); }

    this.buildForm(service);

    this.wizard.next();*/
  }

  startProcess() {
    this.isSubmitted = true;

    if (this.initForm.invalid) {
      return this.commonSrv.alert('warning', 'form.required_fields', 'transactions.service');
    }


    const data: ProcessStartRequest = {
      processDefinitionKey: this.processSelected.key,
      businessKey: `${Date.now()}`,
      formData: this.initForm.value,
      initiatorUserId: ''
    };

    this.factorySrv.startProcess(data).subscribe({
      next: res => {
        console.log(res);
        this.commonSrv.router.navigate(['transactions/history/agent'])
        //this.wizard.previous();
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
      password: code
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
      error: err => this.commonSrv.errorHandle(err, 'transactions.download_receipt_payment_failed', 'transactions.payment_service')
    });
  }

  onConfirmStep() {
    this.wizard.disableNav();
  }

  openModal(content: TemplateRef<never>) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true, size : 'lg' });
  }

  get isOddForm(): boolean {
    return this.sizeOfForm % 2 !== 0;
  }

  get sf() {
    return this.initForm?.controls;
  }

  private buildVoidForm() {
    const group: any = {}
    this.sizeOfForm = 0;
    this.isSubmitted = false;
    this.initForm = this.fb.group(group);
  }

  private buildForm(form: Form) {
    const group: any = {}
    this.sizeOfForm = 0;
    this.isSubmitted = false;
    form.components
        //.sort((a, b) => a.position - b.position)
        .forEach(item => {
          const validators = [];
          if(item.validate){
             if (item.validate.required) validators.push(Validators.required);
             if (item.validate.pattern) validators.push(Validators.pattern(item.validate.pattern));
             if(item.validate.minLength) validators.push(Validators.minLength(item.validate.minLength));
             if(item.validate.maxLength) validators.push(Validators.minLength(item.validate.maxLength));

          }
          group[item.key] = ['', validators];
          this.sizeOfForm++;
        });
    this.initForm = this.fb.group(group);
  }
}
