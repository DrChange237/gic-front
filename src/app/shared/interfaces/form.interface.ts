

export interface FormValidation {
  required: boolean;
  minLength: number;
  maxLength: number;
  min: number;
  max: number;
  pattern: string;
  validationType:string;
}

export interface FormSelectOption {
  label: string;
  value:string;
}

export interface FormMetadata {
  processDefinitionId: string;
  processDefinitionKey:string;
  processDefinitionVersion: number;
  formKey: string;
  formResourceName:string
  deploymentId:string;
}

export interface FormConditional {
  hide: string;
}

export interface FormLayout{
    row : string;
    columns : number;
}

export interface FormComponent {
  label: string;
  type:string;
  id: string;
  key: string;
  description:string;
  defaultValue:any;
  validate:FormValidation;
  properties : Record<string, any>;
  values : FormSelectOption[];
  conditional : FormConditional;
  disabled : boolean;
  readonly : boolean;
  layout : FormLayout;
  multiple : boolean;
  accept: string;
  maxFileSize : number;
  extratype : string;
}

export interface FormExporter {
  name: string;
  version: string;
}

export interface Form {
  schemaVersion: number;
  exporter: FormExporter;
  type : string;
  id : string;
  executionPlatform : string;
  executionPlatformVersion : string;
  components : FormComponent[];
  metadata : FormMetadata;
}

export interface FormResponse {
  form: Form;
  message : string;
  success : boolean;
  metadata : FormMetadata;
}
