import { Component, OnInit } from '@angular/core';
import {CommonModule} from "@angular/common";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {UntypedFormGroup, ReactiveFormsModule, UntypedFormBuilder, Validators} from "@angular/forms";
//
import {SharedComponentsModule} from "../../../shared/components/shared-components.module";
import {CommonService} from "../../../core/services/common.service";
import {FactoryService} from "../../../core/services/factory.service";
import {
  ConfirmActionModalComponent
} from "../../../shared/components/confirm-action-modal/confirm-action-modal.component";
import {ActionResultModalComponent} from "../../../shared/components/action-result-modal/action-result-modal.component";
import {TranslatePipe} from "@ngx-translate/core";
import {Agency} from "../../../shared/interfaces";
import {AccountService} from "../../../core/services/account.service";
import {NgSelectComponent} from "@ng-select/ng-select";

@Component({
  selector: 'app-mgn-fund-transfer',
  templateUrl: './mgn-fund-transfer.component.html',
  styleUrls: ['./mgn-fund-transfer.component.scss'],
  imports: [CommonModule, SharedComponentsModule, ReactiveFormsModule, TranslatePipe, NgSelectComponent],
  standalone: true
})
export class MgnFundTransfer implements OnInit {
  transfertForm: UntypedFormGroup
  isSubmitted: boolean = false;

  agencies$: Agency[]
  sources$: Agency[];
  beneficiaries$: Agency[];

  constructor(
      private fb: UntypedFormBuilder,
      private modalService: NgbModal,
      private commonSrv: CommonService,
      private factorySrv: FactoryService,
      private accountSrv: AccountService,
  ) {
    this.initializeForm();
  }

  ngOnInit() {
    this.accountSrv.getListAgencies().subscribe(res => {
      this.agencies$ = res;
      this.sources$ = res;
      this.beneficiaries$ = res;
    });
  }

  initializeForm() {
    this.transfertForm = this.fb.group({
      agencyOriginId: [null, Validators.required],
      agencyDestinationId: [null, Validators.required],
      amount: [null, Validators.required],
      description: ['', Validators.required],
    });
  }

  get sf() {
    return this.transfertForm.controls;
  }

  openConfirmModal() {
    this.isSubmitted = true;

    if (this.transfertForm.invalid) {
      return this.commonSrv.alert('warning', 'form.required_fields', 'transactions.service');
    }

    const modalRef = this.modalService.open(ConfirmActionModalComponent, {
      centered: true, backdrop: 'static',
    });

    modalRef.componentInstance.title = 'navigation.transfer_fund';
    modalRef.componentInstance.message = 'modal.confirm_transaction_service';
    modalRef.componentInstance.requirePin = false;

    modalRef.result.then((res: string) => res && this.confirmTransfert(res));
  }

  resetForm() {
    this.transfertForm.reset();
    this.isSubmitted = false;
  }

  private  confirmTransfert(code: string) {
    const data = { ...this.transfertForm.getRawValue(), password: code };

    this.factorySrv.transferToAgency(data).subscribe({
      next: () => {
        const resultModal = this.modalService.open(ActionResultModalComponent, {
          centered: true, backdrop: 'static',
        });

        resultModal.componentInstance.title = 'transactions.fund_transfert';
        resultModal.componentInstance.message = 'transactions.payment_successful';
        resultModal.componentInstance.isSuccess = true;

        this.resetForm();
      },
      error: err => this.commonSrv.errorHandle(err, 'transactions.transfert_fund_transaction_failed', 'transactions.fund_transfert')
    });
  }

  onChangeAgencies(agency: Agency, target: 'SOURCE' | 'BENEFICIARY' = 'BENEFICIARY') {
    if (target === 'SOURCE') {
      this.sources$ = this.agencies$.filter(a => !agency || a.code !== agency.code)
    } else {
      this.beneficiaries$ = this.agencies$.filter(a => !agency || a.code !== agency.code)
    }
  }

}
