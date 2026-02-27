import { Injectable } from '@angular/core';
import {BaseApiService} from "./base-api.service";
import {HttpClient} from "@angular/common/http";
import {

} from "../../shared/interfaces";
import {tap} from "rxjs";
import { Dossier, FileInfo, Inscription, Money } from 'src/app/shared/interfaces/business.interface';
import { ta } from 'date-fns/locale';

@Injectable({
  providedIn: 'root'
})
export class BusinessService extends BaseApiService {
 

  constructor(
      protected http: HttpClient
  ) {
    super(http)
  }

  getListInscriptions(search: string) {
        return this.get<Inscription[]>(`business/inscription`, { search });
  }

  downloadDocument(reference: string, tag :string) {
        return this.get<FileInfo>(`business/inscription/download?reference=` + reference + `&tag=` + tag);
  }

  getListDossiers(search: string,  archived : boolean) {
         return this.get<Dossier[]>(`business/contrat?search=` + search + `&archived=` + archived);
  }

  archivedDossier(reference: string) {
         return this.get<Dossier[]>(`business/contrat/archived?reference=` + reference);
  }

   getMoneyDossiers(reference: string) {
         console.log(reference)
         return this.get<Money[]>(`business/contrat/money?reference=` + reference);
  }

 
}
