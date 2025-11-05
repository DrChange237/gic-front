import { Component, OnInit } from '@angular/core';
import { SharedComponentsModule } from "src/app/shared/components/shared-components.module";
import {FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup} from "@angular/forms";
import {FormWizardModule} from "../../../shared/components/form-wizard/form-wizard.module";

@Component({
  selector: 'app-trx-services',
  templateUrl: './trx-services.component.html',
  styleUrls: ['./trx-services.component.scss'],
  imports: [SharedComponentsModule, FormWizardModule, FormsModule, ReactiveFormsModule],
  standalone: true,
})
export class TrxServicesComponent implements OnInit {

  isCompleted: boolean;
  data: any = {
    email: ''
  };
  step2Form: UntypedFormGroup;

  constructor(
      private fb: UntypedFormBuilder
  ) { }

  ngOnInit() {
    this.step2Form = this.fb.group({});
  }

  onStep1Next(e) {}

  onStep2Next(e) {}

  onStep3Next(e) {}

  onComplete(e) {}

}
