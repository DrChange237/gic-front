import {Component, Input, OnInit} from '@angular/core';
import {SharedComponentsModule} from "../../../shared/components/shared-components.module";
import {CommonModule} from "@angular/common";
import {NgbActiveModal, NgbNavModule} from "@ng-bootstrap/ng-bootstrap";
import {Transaction} from "../../../shared/interfaces";
import {SharedPipesModule} from "../../../shared/pipes/shared-pipes.module";
import {TranslatePipe} from "@ngx-translate/core";

@Component({
  selector: 'app-trx-detail-modal',
  templateUrl: './trx-detail-modal.component.html',
  styleUrls: ['./trx-detail-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, SharedComponentsModule, NgbNavModule, SharedPipesModule, TranslatePipe]
})
export class TrxDetailModalComponent implements OnInit {
  @Input() transaction: Transaction;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  close() {
    this.activeModal.close();
  }

}
