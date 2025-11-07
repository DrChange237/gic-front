export interface FormItemOptions {
    label: string;
    amount: number;
    id: string;
    description: string;
}

export interface FormItem {
    id: string;
    label: string;
    name: string;
    type: string;
    position: number;
    regex: string;
    optionString: string;
    removeBill: boolean;
    required: boolean;
    options: FormItemOptions[];
}

export interface ServiceForm {
    name: string;
    formItems: FormItem[];
}

export interface ServiceType {
    id: string,
    code: string,
    name: string,
    logo: string,
    visible: boolean,
    file: string
}

export interface ServiceModel {
    id: string;
    type: ServiceType;
    logo: string;
    name: string;
    reverse: boolean;
    code: string;
    labelRef: string;
    typeRef: string;
    labelOption: string;
    withAmount: boolean;
    withRef: boolean;
    withOptions: boolean;
    withForm: boolean;
    regex: string;
    initForm: ServiceForm;
    description: string;
    typeAccount: string;
    instructions: string;
}
