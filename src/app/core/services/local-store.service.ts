import { Injectable } from '@angular/core';
import {SecureDataService} from "./secure-data.service";
import {KeyStore} from "../../shared/enums";

const SECRET_KEY = 'SECRET_KEY';

@Injectable({
  providedIn: 'root'
})
export class LocalStoreService {
  private whiteList: string[] = [KeyStore.LANG];

  private session = sessionStorage;
  private ls = localStorage;

  constructor(private secure: SecureDataService) {
    this.secure.setSecret(this.session.getItem(this.secure.hash(SECRET_KEY)) || SECRET_KEY);
    if (this.secure.getSecret() === SECRET_KEY) { this.clear(); }
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
      return !data || typeof data === 'string' ? data : JSON.stringify(data);
    }

    const eKey = this.secure.hash(key);
    const eData =  this.session.getItem(eKey);
F
    return eData ? this.secure.decrypt(eData) : null;
  }

  public removeItem(key) {
    const eKey = this.secure.hash(key);
    this.session.removeItem(eKey);
  }

  public clear() {
    this.session.clear();
  }

  public async generateSecret(secret: string): Promise<void> {
    const encoder = new TextEncoder();
    const data = encoder.encode(secret);

    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    this.session.setItem(this.secure.hash(SECRET_KEY), hashHex);
  }
}
