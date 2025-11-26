import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class SecureDataService {

  private secretKey = 'MaCléSuperSecrète123!';
  
  constructor() {}

  setSecret(value: string) { this.secretKey = value; }

  getSecret() { return this.secretKey; }

  encrypt(data: any): string {
    const text = typeof data === 'string' ? data : JSON.stringify(data);
    return CryptoJS.AES.encrypt(text, this.secretKey).toString();
  }

  decrypt(cipherText: string): any {
    try {
      const bytes = CryptoJS.AES.decrypt(cipherText, this.secretKey);
      const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
      return typeof decryptedText === 'string' ? decryptedText : JSON.parse(decryptedText);
    } catch (e) {
      return null;
    }
  }

  hash(value: string): string {
    return CryptoJS.SHA256(value).toString();
  }

  encryptParams(data: any): string {
    const text = typeof data === 'string' ? data : JSON.stringify(data);
    return CryptoJS.Rabbit.encrypt(text, 'filter-data-params').toString();
  }

  decryptParams(cipherText: string): any {
    try {
      const bytes = CryptoJS.Rabbit.decrypt(cipherText, 'filter-data-params');
      const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decryptedText);
    } catch (e) {
      return null;
    }
  }

}
