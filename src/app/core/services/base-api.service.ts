import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export abstract class BaseApiService {
  baseUrl: string = '';

  protected constructor(protected http: HttpClient) {
    this.baseUrl = this.resolveBaseUrl() + '/agency-banking';
  }

  private resolveBaseUrl(): string {
    const host = window.location.host;

    if (host.includes('applications-dev')) return environment.API_URL_TEST;
    if (host.includes('localhost')) return environment.API_URL_DEV;
    return environment.API_URL;
  }

  resolveImgUrl(): string {
    return this.resolveBaseUrl().replace('2030', '8080')
  }

  private buildOptions(options?: {
    headers?: Record<string, string>;
    params?: Record<string, string | number | boolean>;
    responseType?: string;
  }) {
    let httpHeaders = new HttpHeaders(options?.headers || {});
    let httpParams = new HttpParams();

    if (options?.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        if (value) httpParams = httpParams.set(key, value.toString());
      });
    }

    const optionsFormatted = { headers: httpHeaders, params: httpParams };

    if (options?.responseType) optionsFormatted['responseType'] = options.responseType;

    return optionsFormatted;
  }

  // GET
  protected get<T>(endpoint: string, options?: any): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${endpoint}`, this.buildOptions(options));
  }

  // POST
  protected post<T>(endpoint: string, body: any, options?: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${endpoint}`, body, this.buildOptions(options));
  }

  // PUT
  protected put<T>(endpoint: string, body: any, options?: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${endpoint}`, body, this.buildOptions(options));
  }

  // PATCH
  protected patch<T>(endpoint: string, body: any, options?: any): Observable<T> {
    return this.http.patch<T>(`${this.baseUrl}/${endpoint}`, body, this.buildOptions(options));
  }

  // DELETE
  protected delete<T>(endpoint: string, options?: any): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}/${endpoint}`, this.buildOptions(options));
  }
}
