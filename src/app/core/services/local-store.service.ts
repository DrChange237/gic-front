import { Injectable } from '@angular/core';
import {SecureDataService} from "./secure-data.service";
import {KeyStore} from "../../shared/enums";

@Injectable({
  providedIn: 'root'
})
export class LocalStoreService {
  private whiteList: string[] = [KeyStore.LANG];

  private session = sessionStorage;
  private ls = localStorage;

  constructor(private secure: SecureDataService) {
    if (this.checkSecret()) { this.clear(); }
  }

  public setItem(key: string, value: any) {
    const eKey = this.secure.hash(key);
    const eData = this.secure.encrypt(value);

    this.whiteList.includes(key) ? this.ls.setItem(key, value) : this.session.setItem(eKey, eData);
    return true;
  }

  public getItem(key) {
    if (this.whiteList.includes(key)) {
      const data = this.ls.getItem(key);
      return this.parse(data);
    }

    const eKey = this.secure.hash(key);
    const eData =  this.session.getItem(eKey);

    return eData ? this.secure.decrypt(eData) : null;
  }

  public removeItem(key) {
    const eKey = this.secure.hash(key);
    this.session.removeItem(eKey);
  }

  public clear() {
    this.session.clear();
  }

  public async setSecret(secret: string): Promise<void> {
    /*const encoder = new TextEncoder();
    const data = encoder.encode(secret);

    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    const eHashHex = this.secure.encryptParams(hashHex);

    this.secure.setSecret(hashHex);
    this.session.setItem(this.secure.hash(KeyStore.SECRET), eHashHex);*/
  }

  private checkSecret() {
    const value = this.session.getItem(this.secure.hash(KeyStore.SECRET));
    if (!value) return true

    this.secure.setSecret(this.secure.decryptParams(value));
  }

  private parse(value: string) {
    if (!value || !(value.startsWith('{') || value.startsWith('['))) {
      return value;
    }
    return JSON.parse(value);
  }
}
