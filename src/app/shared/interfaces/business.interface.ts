
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
}