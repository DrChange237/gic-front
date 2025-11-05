import { Component, OnInit } from '@angular/core';
import { SharedComponentsModule } from "src/app/shared/components/shared-components.module";

@Component({
  selector: 'app-trx-history',
  templateUrl: './trx-history.component.html',
  styleUrls: ['./trx-history.component.scss'],
  imports: [SharedComponentsModule],
})
export class TrxHistoryComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
