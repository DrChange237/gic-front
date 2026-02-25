import {Component, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {catchError, of} from "rxjs";
import {FormsModule} from "@angular/forms";
import {NgSelectComponent} from "@ng-select/ng-select";
import {NgbModal, NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {TranslatePipe} from "@ngx-translate/core";
//
import {ConfirmActionModalComponent} from "../../../shared/components/confirm-action-modal/confirm-action-modal.component";
import {Agency} from "../../../shared/interfaces";
import { SharedComponentsModule } from "src/app/shared/components/shared-components.module";
import {BaseListNonPagedComponent} from "../../../core/utils/base-list/base-list-unpaged.component";
import {CommonService} from "../../../core/services/common.service";
import {AccountService} from "../../../core/services/account.service";
import {ActionResultModalComponent} from "../../../shared/components/action-result-modal/action-result-modal.component";
import {NgScrollbar} from "ngx-scrollbar";
import {TableDetailComponent} from "../../../shared/components/table-detail/table-detail.component";
import {Permission} from "../../../shared/enums/permission";
import {HasPermissionDirective} from "../../../shared/directives/permission.directive";
import {SecureDataService} from "../../../core/services/secure-data.service";
import {MgnAgencyDetailModalComponent} from "../mgn-agency-detail-modal/mgn-agency-detail-modal.component";
import { Dossier, Inscription } from 'src/app/shared/interfaces/business.interface';
import { BusinessService } from 'src/app/core/services/business.service';
import { MgnDossiersMoneyModalComponent } from '../mgn-dossiers-money-modal/mgn-dossiers-money-modal.component';

@Component({
  selector: 'app-mgn-dossiers',
  templateUrl: './mgn-dossiers.component.html',
  styleUrls: ['./mgn-dossiers.component.scss'],
  imports: [CommonModule, SharedComponentsModule, FormsModule, NgSelectComponent, NgbModule, TranslatePipe, NgScrollbar,
    TableDetailComponent, HasPermissionDirective],
  standalone: true
})
export class MgnDossiersComponent extends BaseListNonPagedComponent<Dossier> implements OnInit {

  protected readonly Permission = Permission;

  constructor(
      private modalService: NgbModal,
      private businessSrv: BusinessService,
      private commonSrv: CommonService,
      private secureSrv: SecureDataService,
  ) {
    super();
  }

  override fetchData() {
    return this.businessSrv.getListDossiers(this.searchTerm).pipe(
        catchError(err => {
          err && this.commonSrv.errorHandle(err, 'account.get_agency_list_failed', 'account.role');
          return of(null);
        })
    );
  }

  protected override filterData(items: Dossier[], filter: string): Dossier[] {
    const lowerTerm = filter.toLowerCase();
    return items.filter(contrat =>
        contrat.reference?.toLowerCase()?.includes(lowerTerm) ||
        contrat.status?.toLowerCase()?.includes(lowerTerm) ||
        contrat.equivalenceStatus?.toLowerCase()?.includes(lowerTerm)
    );
  }

  viewHistoryAgency(agency: Agency){
    const param = this.secureSrv.encryptParams({id: agency.id, name: agency.name});
    this.commonSrv.router.navigate(['transactions/history/agency', param])
  }

  viewOperationReview(agency: Agency){
    const param = this.secureSrv.encryptParams(
        { id: agency.id, name: agency.name, availability: agency.avaibility }
    );
    this.commonSrv.router.navigate(['management/operation-review', param])
  }

  openConfirmModal(agency: Agency) {
    const modalRef = this.modalService.open(ConfirmActionModalComponent, {
      centered: true, backdrop: 'static',
    });

    modalRef.componentInstance.title = agency.enabled ? 'modal.disable' : 'modal.enable';
    modalRef.componentInstance.message = this.commonSrv.translate.instant(
        agency.enabled ? 'modal.disable_message' : 'modal.enable_message',
        { name: agency.name });
    modalRef.componentInstance.withoutAuth = true;

    modalRef.result.then((res: string) => res && this.onChangeStatusAgency(agency));
  }

  onChangeStatusAgency(agency: Agency) {
    /*this.accountSrv.changAgencyStatus(agency.code, !agency.enabled).subscribe({
      next: () => { this.openResultModal(agency.id) },
      error: err => this.commonSrv.errorHandle(err, 'account.update_status_agency_failed', 'account.agent')
    });*/
  }

  openResultModal(code: string) {
      const resultModal = this.modalService.open(ActionResultModalComponent, {
        centered: true,
      });

      resultModal.componentInstance.message = 'account.update_status_agency_done';
      resultModal.componentInstance.isSuccess = true;

      resultModal.result.then(() => {
        const items = this.allItems;
        const index = items.findIndex(c => c.id === code);
        //items[index] = { ...items[index], enabled: !items[index].enabled };
        this._allItems$.next(items);
        this.updatePaged();
      });
  }

  downloadDocument(reference, tag){
    this.businessSrv.downloadDocument(reference, tag).subscribe({
      next: res => {
            window.open(this.resolveBaseUrl() + "/files/" + res.url, '_blank');
        },
      error: err => this.commonSrv.errorHandle(err, 'account.update_status_agency_failed', 'account.agent')
    });
  }

  private resolveBaseUrl(): string {
    const port = window.location.port;           // "80", "8081", "4200"
    if (port=='4200') return 'http://158.220.104.244:2025/api';
    if (port=='3000') return 'http://158.220.104.244:2026/api';
    return 'http://158.220.104.244:2025/api';
  }

  openMoney(dossier: Dossier) {
    if (!dossier) return;

    console.log(dossier)

    this.businessSrv.getMoneyDossiers(dossier.reference).subscribe({
      next: res => {

        const modalRef = this.modalService.open(
            MgnDossiersMoneyModalComponent, { size: "lg", ariaLabelledBy: 'modal-basic-title', centered: true }
        );

        modalRef.componentInstance.dossier = res;
      },
      error: err => {
        console.log(err); this.commonSrv.errorHandle(err, 'transactions.get_detail_transaction_failed', 'account.role') }
    });
  }
}
