import { Component, OnInit } from '@angular/core';
import { SharedComponentsModule } from "src/app/shared/components/shared-components.module";

@Component({
  selector: 'app-mgn-agents',
  templateUrl: './mgn-agents.component.html',
  styleUrls: ['./mgn-agents.component.scss'],
  imports: [SharedComponentsModule]
})
export class MgnAgentsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
