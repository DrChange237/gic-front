import { Injectable } from '@angular/core';
import {BaseApiService} from "./base-api.service";
import {HttpClient} from "@angular/common/http";
import {ListResponse} from "../utils/base-list/base-list.component";
import {Report} from "../../shared/interfaces";

@Injectable({
  providedIn: 'root'
})
export class ReportingService extends BaseApiService {

  constructor(
      protected http: HttpClient
  ) {
    super(http)
  }

  downloadReport(reportId: string) {
    return this.get<Blob>(`report/download`, {
      params: { reportId: reportId }, responseType: 'blob'
    });
  }

  getReporting(filter: Record<string, string | number | boolean>) {
    return this.get<ListResponse<Report>>(`report`, { params: filter })
  }

}
