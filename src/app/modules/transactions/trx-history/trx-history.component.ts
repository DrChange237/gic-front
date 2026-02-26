import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NgbModal, NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {CommonModule, formatDate} from "@angular/common";
import {NgSelectModule} from "@ng-select/ng-select";
import {TranslatePipe} from "@ngx-translate/core";
import {ActivatedRoute, Router} from "@angular/router";
import {catchError, of} from "rxjs";
import {FormControl, FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
//
import {BaseListComponent, ListQuery} from "../../../core/utils/base-list/base-list.component";
import {SharedComponentsModule} from "../../../shared/components/shared-components.module";
import {SharedPipesModule} from "../../../shared/pipes/shared-pipes.module";
import {FactoryService} from "../../../core/services/factory.service";
import {CommonService} from "../../../core/services/common.service";
import {HistoryStep, ProcessModel, ProcessVariable, TaskDetail, TaskModel, Transaction, Document, CompleteTask} from "../../../shared/interfaces";
import {Permission} from "../../../shared/enums/permission";
import {HasPermissionDirective} from "../../../shared/directives/permission.directive";
import {SecureDataService} from "../../../core/services/secure-data.service";
import {TrxDetailModalComponent} from "../trx-detail-modal/trx-detail-modal.component";
import { WizardComponent } from 'src/app/shared/components/form-wizard/wizard/wizard.component';
import { FormWizardModule } from 'src/app/shared/components/form-wizard/form-wizard.module';
import { ActivityHistoryInfo, DocumentInfo, TaskDetailsResponse, TaskInfo } from 'src/app/shared/interfaces/task.interfaces';
import { Form, FormComponent } from 'src/app/shared/interfaces/form.interface';
import { PROCESS_ICONS } from 'src/app/core/utils/icons/process';

@Component({
  selector: 'app-trx-history',
  templateUrl: './trx-history.component.html',
  styleUrls: ['./trx-history.component.scss'],
  imports: [CommonModule, SharedPipesModule, SharedComponentsModule,FormWizardModule, FormsModule, NgbModule, NgSelectModule,
    TranslatePipe, ReactiveFormsModule, HasPermissionDirective],
  standalone: true,
})
export class TrxHistoryComponent extends BaseListComponent<Transaction> implements OnInit {
   @ViewChild(WizardComponent) wizard!: WizardComponent;

  paramsFilter: { id: string, name: string } | null = null;
  historyType: string = '';
  processes$ : ProcessModel[];
  tasks$ : TaskModel[];
  taskDetail : TaskDetailsResponse;
  task : TaskInfo;
  initForm: UntypedFormGroup;
  sizeOfForm: number = 0;
  taskVariables: any;


  documents: DocumentInfo[] = [];
  loading = true;
  activeTab: 'variables' | 'documents' | 'history' | 'tutorial' = 'variables';

  isSubmitted: boolean;
  processForm: Form;
  uploadedFiles: Map<string, File[]> = new Map(); // Stockage des fichiers

  

  protected readonly Permission = Permission;

  constructor(
      private fb: UntypedFormBuilder,
      private modalService: NgbModal,
      private route: ActivatedRoute,
      private commonSrv: CommonService,
      private factorySrv: FactoryService,
      private secureSrv: SecureDataService,
      private router: Router
  ) {
    super();
    this.initializeForm();
    this.historyType = this.route.snapshot.data['history'];
  }

  ngOnInit() {
    this.loadProcesses();
  }

  processImage(key : string): string {
      return PROCESS_ICONS[key] || 'assets/images/default.png';
    }

  initializeForm() {
    this.filterForm = this.fb.group({
      reference: [''],
      startDate: [null],
      endDate: [null]
    });

    const param = this.route.snapshot.paramMap.get('data');
    if (param) this.paramsFilter = this.secureSrv.decryptParams(param);
  }

  openModal(content: TemplateRef<never>) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true, size : 'lg' });
  }
  

  onConfirmStep() {
    this.wizard.disableNav();
  }

  loadProcesses() {
    this.factorySrv.getProcesses().subscribe({
      next: res => {
        this.processes$ = res;
        this.loadMyTasks();
      },
      error: err => this.commonSrv.errorHandle(err, 'transactions.get_service_failed', 'transactions.service')
    });
  }

  getDefaultValue(field: FormComponent): any {
    if (field.defaultValue !== undefined) {
      return field.defaultValue;
    }

    switch (field.type) {
      case 'checkbox':
        return false;
      case 'checklist':
        return []; // Retourne un tableau vide pour checklist
      case 'filepicker':
        return null; // Pas de valeur par défaut pour filepicker
      case 'number':
        return null;
      case 'textfield':
      case 'textarea':
      case 'select':
      default:
        return '';
    }
  }

  getValidators(field: FormComponent): any[] {
    const validators = [];

    if (field.validate?.required) {
      validators.push(Validators.required);
    }

    if (field.validate?.minLength) {
      validators.push(Validators.minLength(field.validate.minLength));
    }

    if (field.validate?.maxLength) {
      validators.push(Validators.maxLength(field.validate.maxLength));
    }

    if (field.validate?.min !== undefined) {
      validators.push(Validators.min(field.validate.min));
    }

    if (field.validate?.max !== undefined) {
      validators.push(Validators.max(field.validate.max));
    }

    if (field.validate?.pattern) {
      validators.push(Validators.pattern(field.validate.pattern));
    }

    if (field.type === 'number') {
      validators.push(Validators.pattern(/^-?\d*\.?\d+$/));
    }

    return validators;
  }

  isFieldInvalid(fieldKey: string): boolean {
    const field = this.initForm.get(fieldKey);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getErrorMessage(field: FormComponent): string {
    const control = this.initForm.get(field.key);
    if (!control || !control.errors) return '';

    if (control.errors['required']) {
      return `${field.label} est requis`;
    }
    if (control.errors['minlength']) {
      return `Minimum ${control.errors['minlength'].requiredLength} caractères`;
    }
    if (control.errors['maxlength']) {
      return `Maximum ${control.errors['maxlength'].requiredLength} caractères`;
    }
    if (control.errors['min']) {
      return `Valeur minimum: ${control.errors['min'].min}`;
    }
    if (control.errors['max']) {
      return `Valeur maximum: ${control.errors['max'].max}`;
    }
    if (control.errors['pattern']) {
      return `Format invalide`;
    }
    return 'Erreur de validation';
  }

  async prepareSubmissionData(formData: any): Promise<any> {
    const variables: any = {};
    
    for (const key of Object.keys(formData)) {
      const field = this.processForm?.components.find(f => f.key === key);
      
      if (field?.type === 'filepicker') {
        // Convertir les fichiers en base64
        const files = this.uploadedFiles.get(key) || [];
        if (files.length > 0) {
          const filesData = await Promise.all(files.map(async (file) => {
            const base64 = await this.convertFileToBase64(file);
            return {
              name: file.name,
              type: file.type,
              size: file.size,
              content: base64
            };
          }));
          
          variables[key] = {
            value: JSON.stringify(filesData),
            type: 'String'
          };
        }
      } else {
        variables[key] = {
          value: formData[key],
          type: this.getVariableType(formData[key])
        };
      }
    }

    return variables;
  }

  async convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  formatVariables(formData: any): any {
    const variables: any = {};
    
    Object.keys(formData).forEach(key => {
      variables[key] = {
        value: formData[key],
        type: this.getVariableType(formData[key])
      };
    });

    return variables;
  }

  getVariableType(value: any): string {
    if (typeof value === 'boolean') return 'Boolean';
    if (typeof value === 'number') return 'Long';
    if (value instanceof Date) return 'Date';
    return 'String';
  }

  // Méthodes pour gérer le filepicker
  onFileSelected(event: any, field: FormComponent): void {
    const files: FileList = event.target.files;
    console.log(files)
    
    if (!files || files.length === 0) return;

    const fileArray: File[] = Array.from(files);
    const control = this.initForm.get(field.key);

    // Validation de la taille des fichiers
    if (field.maxFileSize) {
      const oversizedFiles = fileArray.filter(f => f.size > field.maxFileSize!);
      if (oversizedFiles.length > 0) {
        alert(`Fichier(s) trop volumineux. Taille max: ${this.formatFileSize(field.maxFileSize)}`);
        return;
      }
    }

    // Validation du type de fichier
    if (field.accept) {
      const acceptedTypes = field.accept.split(',').map(t => t.trim());
      const invalidFiles = fileArray.filter(f => {
        const ext = '.' + f.name.split('.').pop()?.toLowerCase();
        return !acceptedTypes.some(type => 
          type === ext || 
          (type.includes('*') && f.type.startsWith(type.split('/')[0]))
        );
      });
      
      if (invalidFiles.length > 0) {
        alert(`Type de fichier non autorisé. Types acceptés: ${field.accept}`);
        return;
      }
    }

    // Stocker les fichiers
    if (field.multiple) {
      const existingFiles = this.uploadedFiles.get(field.key) || [];
      this.uploadedFiles.set(field.key, [...existingFiles, ...fileArray]);
    } else {
      this.uploadedFiles.set(field.key, [fileArray[0]]);
    }

    // Mettre à jour le contrôle avec les noms de fichiers
    const fileNames = this.uploadedFiles.get(field.key)?.map(f => f.name) || [];
    control?.setValue(fileNames.join(', '));
    control?.markAsTouched();
  }

  removeFile(field: FormComponent, index: number): void {
    const files = this.uploadedFiles.get(field.key) || [];
    files.splice(index, 1);
    
    if (files.length === 0) {
      this.uploadedFiles.delete(field.key);
      this.initForm.get(field.key)?.setValue(null);
    } else {
      this.uploadedFiles.set(field.key, files);
      const fileNames = files.map(f => f.name).join(', ');
      this.initForm.get(field.key)?.setValue(fileNames);
    }
  }

  getUploadedFiles(field: FormComponent): File[] {
    return this.uploadedFiles.get(field.key) || [];
  }

  async convertFilesToBase64(files: File[]): Promise<string[]> {
    const promises = files.map(file => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = (reader.result as string).split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });
    return Promise.all(promises);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

   // Méthodes pour gérer les checklists
  onChecklistChange(field: FormComponent, optionValue: string, checked: boolean): void {
    const control = this.initForm.get(field.key);
    if (!control) return;

    let currentValue: string[] = control.value || [];
    console.log(currentValue);

    if (checked) {
      // Ajouter la valeur si cochée
      if (!currentValue.includes(optionValue)) {
        currentValue = [...currentValue, optionValue];
      }
    } else {
      // Retirer la valeur si décochée
      currentValue = currentValue.filter(v => v !== optionValue);
    }

    control.setValue(currentValue);
    control.markAsTouched();
  }

  isChecklistOptionChecked(field: FormComponent, optionValue: string): boolean {
    const control = this.initForm.get(field.key);
    const values: string[] = control?.value || [];
    return values.includes(optionValue);
  }

  completeTask() {
      this.isSubmitted = true;
  
      if (this.initForm.invalid) {
        return this.commonSrv.alert('warning', 'form.required_fields', 'transactions.service');
      }
  
      const formData = this.initForm.value;

      const data = new FormData();

      Object.keys(formData).forEach(key => {
        if (formData[key] instanceof File) {
          data.append(`file-${key}`, formData[key]);
        } else if (typeof formData[key] === 'object') {
          data.append(key, JSON.stringify(formData[key]));
        } else {
          data.append(key, formData[key]);
        }
      });
      data.append('taskId', this.taskDetail.task.id),
  
      // const data: CompleteTask = {
      //   formData: this.initForm.value,
      //   taskId: this.taskDetail.task.id
      // };
  
      this.factorySrv.completeTask(data).subscribe({
        next: res => {
          console.log(res);
          this.loadMyTasks();
          this.wizard.previous()
          this.wizard.previous()
        },
        error: err => this.commonSrv.errorHandle(err, 'transactions.init_payment_failed', 'transactions.payment_service')
      });
      this.isSubmitted = false;
    }

  claim(taskId : string) {
    this.factorySrv.claimTask(taskId).subscribe({
      next: res => {
        this.loadMyTasks();
      },
      error: err => this.commonSrv.errorHandle(err, 'transactions.get_service_failed', 'transactions.service')
    });
  }

  unclaim(taskId : string) {
    this.factorySrv.unClaimTask(taskId).subscribe({
      next: res => {
        this.loadMyTasks();
      },
      error: err => this.commonSrv.errorHandle(err, 'transactions.get_service_failed', 'transactions.service')
    });
  }

  loadMyTasks() {
    this.factorySrv.getMyTasks().subscribe({
      next: res => {
        this.tasks$ = res;
      },
      error: err => this.commonSrv.errorHandle(err, 'transactions.get_service_failed', 'transactions.service')
    });
  }

  loadTaskDetail(task : TaskModel) {
    this.factorySrv.detailTask(task.id).subscribe({
      next: res => {
        this.taskDetail = res;
        this.taskDetail.activityHistory = this.taskDetail.activityHistory.reverse();
        this.task = res.task;
        this.documents = res.documents;
        console.log(this.taskDetail.processVariables);
        this.loading = false;
      },
      error: err => this.commonSrv.errorHandle(err, 'transactions.get_service_failed', 'transactions.service')
    });
  }

  private buildVoidForm() {
    const group: any = {}
    this.sizeOfForm = 0;
    this.isSubmitted = false;
    this.initForm = this.fb.group(group);
  }

  private buildForm(form: Form) {
    const group: any = {}
    //this.sizeOfForm = 0;
    this.isSubmitted = false;
    form.components
        //.sort((a, b) => a.position - b.position)
        .forEach(item => {
          const validators = this.getValidators(item);
          const defaultValue = this.getDefaultValue(item);

          group[item.key] = new FormControl(
            { value: defaultValue, disabled: item.disabled || false },
            validators
          );
          /*if(item.validate){
             if (item.validate.required) validators.push(Validators.required);
             if (item.validate.pattern) validators.push(Validators.pattern(item.validate.pattern));
             if(item.validate.minLength) validators.push(Validators.minLength(item.validate.minLength));
             if(item.validate.maxLength) validators.push(Validators.minLength(item.validate.maxLength));
          }
          group[item.key] = ['', validators];*/
          //this.sizeOfForm++;
        });

    this.initForm = this.fb.group(group);
  }

  loadForm(task: TaskInfo) {
    this.loadVariables(task);
    this.factorySrv.getTaskForm(task.id).subscribe({
      next: res => {
        this.processForm = res.form;
        console.log(this.processForm);
        if(res.form){
           this.buildForm(res.form);
        }else{
           this.buildVoidForm();
        }
        this.wizard.next();
      },
      error: err => this.commonSrv.errorHandle(err, 'transactions.get_service_failed', 'transactions.service')
    });
  }

  loadVariables(task: TaskInfo) {
    this.factorySrv.getTaskVariables(task.id).subscribe({
      next: res => {
        this.taskVariables = res;
        console.log(res);
      },
      error: err => this.commonSrv.errorHandle(err, 'transactions.get_service_failed', 'transactions.service')
    });
  }

  mapVariablesToFormData(variables: any): any {
    const formData = {};
    Object.keys(variables).forEach(key => {
      formData[key] = variables[key].value;
    });
    return formData;
  }

  override search() {
    this._query = this.filterForm.getRawValue();
    if (this.paramsFilter) {
      const entity = this.historyType ? 'agencyId' : 'cashierId';
      this._query[entity] = this.paramsFilter.id;
    }
    this.load();
  }

  override fetchData(query: ListQuery) {
    return this.factorySrv.getTrxHistory(query, this.historyType, this.paramsFilter?.id).pipe(
      catchError(err => {
        err && this.commonSrv.errorHandle(err, 'transactions.get_history_transaction_failed', 'transactions.history');
        return of(null);
      })
    );
  }

  protected override filterData(items: Transaction[], filter: string): Transaction[] {
    const lowerTerm = filter.toLowerCase();
    return items.filter(transaction =>
        transaction.serviceName?.toLowerCase()?.includes(lowerTerm) ||
        transaction.reference?.toLowerCase()?.includes(lowerTerm) ||
        transaction.receiptId?.toLowerCase()?.includes(lowerTerm) ||
        transaction.cashier?.name.toLowerCase()?.includes(lowerTerm) ||
        transaction.cashier?.agency?.name?.toLowerCase()?.includes(lowerTerm) ||
        transaction.amount?.toString()?.includes(lowerTerm)
    );
  }

  downloadReceipt(transaction: Transaction) {
    this.factorySrv.downloadReceipt(transaction.transactionId).subscribe({
      next: res => {
        const name = transaction.serviceName + '-' + formatDate(new Date(), 'yyyy-MM-dd_HH-mm', 'fr-FR');
        this.commonSrv.openFileOnBlank(res, true, `'cca-receipt-${name}.pdf`)
      },
      error: err => this.commonSrv.errorHandle(err, 'transactions.download_receipt_payment_failed', 'transactions.history')
    });
  }

  openDetailTrx(task: TaskModel) {
    this.loadTaskDetail(task);
    this.wizard.next();
  }




  setActiveTab(tab: 'variables' | 'documents' | 'history' | 'tutorial'): void {
    this.activeTab = tab;
  }

  downloadDocument(doc: DocumentInfo): void {
    //console.log('Téléchargement du document:', doc.name);
    // Implémenter la logique de téléchargement
    window.open(this.resolveBaseUrl() + "/files/" + doc.file.url, '_blank');
  }

  private resolveBaseUrl(): string {
    const port = window.location.port;           // "80", "8081", "4200"
    if (port=='4200') return 'http://158.220.104.244:2025/api';
    if (port=='3000') return 'http://158.220.104.244:2026/api';
    return 'http://158.220.104.244:2025/api';
  }


  getStatusClass(step: ActivityHistoryInfo): string {
    if(step.endTime != null){
       return 'status-completed';
    }
    return 'status-active';
  }

  formatVariableValue(variable: ProcessVariable): string {
    if (variable.type === 'Boolean') {
      return variable.value ? 'Oui' : 'Non';
    }
    if (variable.type === 'Date') {
      return new Date(variable.value).toLocaleDateString('fr-FR');
    }
    return String(variable.value);
  }
}
