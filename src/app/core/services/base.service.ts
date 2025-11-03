import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class BaseService {

  constructor() { }

  getUrl(): string {
    const basePath = window.location.host;
    if (basePath.includes('applications-dev')) return environment.API_URL_TEST;
    if (basePath.includes('localhost')) return environment.API_URL_DEV;
    return environment.API_URL;
  }
}
