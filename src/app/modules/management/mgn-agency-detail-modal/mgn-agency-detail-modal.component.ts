import {Component, Input, OnInit} from '@angular/core';
import {SharedComponentsModule} from "../../../shared/components/shared-components.module";
import {CommonModule} from "@angular/common";
import {NgbActiveModal, NgbNavModule} from "@ng-bootstrap/ng-bootstrap";
import {Agency} from "../../../shared/interfaces";
import {SharedPipesModule} from "../../../shared/pipes/shared-pipes.module";
import {TranslatePipe} from "@ngx-translate/core";

@Component({
  selector: 'app-mgn-agency-detail-modal',
  templateUrl: './mgn-agency-detail-modal.component.html',
  styleUrls: ['./mgn-agency-detail-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, SharedComponentsModule, NgbNavModule, SharedPipesModule, TranslatePipe]
})
export class MgnAgencyDetailModalComponent implements OnInit {
  @Input() agency: Agency;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  close() {
    this.activeModal.close();
  }

}
