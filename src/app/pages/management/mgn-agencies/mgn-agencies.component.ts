import { Component, OnInit } from '@angular/core';
import { SharedComponentsModule } from "src/app/shared/components/shared-components.module";

@Component({
  selector: 'app-mgn-agencies',
  templateUrl: './mgn-agencies.component.html',
  styleUrls: ['./mgn-agencies.component.scss'],
  imports: [SharedComponentsModule]
})
export class MgnAgenciesComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
