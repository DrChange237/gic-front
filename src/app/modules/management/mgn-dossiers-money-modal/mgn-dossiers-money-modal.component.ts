import {Component, Input, OnInit} from '@angular/core';
import {SharedComponentsModule} from "../../../shared/components/shared-components.module";
import {CommonModule} from "@angular/common";
import {NgbActiveModal, NgbNavModule} from "@ng-bootstrap/ng-bootstrap";
import {Agency} from "../../../shared/interfaces";
import {SharedPipesModule} from "../../../shared/pipes/shared-pipes.module";
import {TranslatePipe} from "@ngx-translate/core";
import { Dossier, Money } from 'src/app/shared/interfaces/business.interface';

@Component({
  selector: 'app-mgn-dossiers-money-modal',
  templateUrl: './mgn-dossiers-money-modal.component.html',
  styleUrls: ['./mgn-dossiers-money-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, SharedComponentsModule, NgbNavModule, SharedPipesModule, TranslatePipe]
})
export class MgnDossiersMoneyModalComponent implements OnInit {
  @Input() moneys: Money[];

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  close() {
    this.activeModal.close();
  }

}
