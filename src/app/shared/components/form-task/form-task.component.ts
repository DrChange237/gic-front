import { Component, Input } from '@angular/core';
import { Form } from '../../interfaces/form.interface';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { FactoryService } from 'src/app/core/services/factory.service';

interface CamundaFormField {
  type: string;
  id: string;
  key: string;
  label: string;
  description?: string;
  defaultValue?: any;
  validate?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: string;
  };
  values?: Array<{ label: string; value: string }>;
  disabled?: boolean;
}

interface CamundaFormSchema {
  components: CamundaFormField[];
  schemaVersion: number;
  exporter?: any;
  type?: string;
  id?: string;
}

@Component({
  selector: 'app-form-task',
  templateUrl: './form-task.component.html',
  styleUrls: ['./form-task.component.scss'],
  standalone : false
})
export class FormTaskComponent  {
  @Input() taskId!: string;
  
  formSchema: CamundaFormSchema | null = null;
  dynamicForm: FormGroup;
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private factorySrv: FactoryService,
  ) {
    this.dynamicForm = this.fb.group({});
  }

  ngOnInit(): void {
    console.log("APP FORM TASK");
    if (this.taskId) {
      this.loadFormSchema();
    }
  }

  loadFormSchema(): void {
    this.loading = true;
    this.error = '';

    this.factorySrv.getTaskForm(this.taskId).subscribe({
      next: res => {
        this.formSchema = res.form;
        this.buildForm();
        this.loading = false;
      },
      error: (err) => {
          this.error = 'Erreur lors du chargement du formulaire';
          this.loading = false;
          console.error(err);
      }
    });

    /*this.http.get<CamundaFormSchema>(`/api/tasks/${this.taskId}/form`)
      .subscribe({
        next: (schema) => {
          this.formSchema = schema;
          this.buildForm();
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Erreur lors du chargement du formulaire';
          this.loading = false;
          console.error(err);
        }
      });*/
  }

  buildForm(): void {
    if (!this.formSchema?.components) return;

    const group: any = {};

    this.formSchema.components.forEach((field) => {
      const validators = this.getValidators(field);
      const defaultValue = this.getDefaultValue(field);
      
      group[field.key] = new FormControl(
        { value: defaultValue, disabled: field.disabled || false },
        validators
      );
    });

    this.dynamicForm = this.fb.group(group);
  }

  getValidators(field: CamundaFormField): any[] {
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

  getDefaultValue(field: CamundaFormField): any {
    if (field.defaultValue !== undefined) {
      return field.defaultValue;
    }

    switch (field.type) {
      case 'checkbox':
        return false;
      case 'number':
        return null;
      case 'textfield':
      case 'textarea':
      case 'select':
      default:
        return '';
    }
  }

  getFieldType(field: CamundaFormField): string {
    const typeMap: { [key: string]: string } = {
      'textfield': 'text',
      'number': 'number',
      'email': 'email',
      'password': 'password',
      'date': 'date',
      'datetime': 'datetime-local',
      'time': 'time'
    };

    return typeMap[field.type] || 'text';
  }

  isFieldInvalid(fieldKey: string): boolean {
    const field = this.dynamicForm.get(fieldKey);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getErrorMessage(field: CamundaFormField): string {
    const control = this.dynamicForm.get(field.key);
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

  onSubmit(): void {
    if (this.dynamicForm.valid) {
      const formData = this.dynamicForm.getRawValue();
      console.log('Form Data:', formData);
      
      // Soumettre à Camunda
      this.http.post(`/api/tasks/${this.taskId}/complete`, {
        variables: this.formatVariables(formData)
      }).subscribe({
        next: () => {
          console.log('Tâche complétée avec succès');
          // Redirection ou notification
        },
        error: (err) => {
          console.error('Erreur lors de la soumission:', err);
        }
      });
    } else {
      this.markFormGroupTouched(this.dynamicForm);
    }
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

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

}
