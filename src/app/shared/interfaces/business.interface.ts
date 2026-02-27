
export interface Inscription {
  id: string;
  reference:string;
  fullName: string;
  fullNameConjoint: string;
  status:string;
}

export interface Consultation{
  id: string;
  inscription : Inscription;
  observation : string;
}

export interface Dossier{
  id:string;
  consultation : Consultation;
  reference : string;
  status : string;
  restTopay : number;
  equivalenceStatus : string;
  diplomaStatus : string;
  testExamStatus : string;
  selectionStatus : string;
  permanentStatus : string;
}

export interface Money{
   id:string;
   label:string;
   referennce:string;
   amount:number;
   flow : string;
   creationDate : Date
}

export interface FileInfo{
   id:string;
   name:string;
   url:string;
}