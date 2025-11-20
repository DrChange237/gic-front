import { Component, OnInit } from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ActivatedRoute} from "@angular/router";
//
import {SharedComponentsModule} from "../../../shared/components/shared-components.module";
import {CommonService} from "../../../core/services/common.service";
import {FactoryService} from "../../../core/services/factory.service";

@Component({
  selector: 'app-mgn-operation-review',
  templateUrl: './mgn-operation-review.component.html',
  styleUrls: ['./mgn-operation-review.component.scss'],
  imports: [
    SharedComponentsModule
  ],
  standalone: true
})
export class MgnOperationReviewComponent implements OnInit {

  paramsFilter: { id: string, name: string } | null = null;

  constructor(
      private modalService: NgbModal,
      private route: ActivatedRoute,
      private commonSrv: CommonService,
      private factorySrv: FactoryService,
  ) {
    this.initParams();
  }

  ngOnInit() {
    this.getOperationReview();
  }

  getOperationReview() {
    this.factorySrv.getOperationAccount(this.paramsFilter.id).subscribe({
      next: value => console.log(value),
      error: err => this.commonSrv.errorHandle(err, '', '')
    });
  }

  initParams() {
    const param = this.route.snapshot.paramMap.get('data');
    if (param) this.paramsFilter = this.commonSrv.secureSrv.decryptParams(param);
  }

}
