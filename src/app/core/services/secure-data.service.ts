import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class SecureDataService {

  private secretKey = 'MaCléSuperSecrète123!';
  
  constructor() { }

  encrypt(data: any): string {
    const text = typeof data === 'string' ? data : JSON.stringify(data);
    return CryptoJS.AES.encrypt(text, this.secretKey).toString();
  }

  decrypt(cipherText: string): any {
    try {
      const bytes = CryptoJS.AES.decrypt(cipherText, this.secretKey);
      const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decryptedText);
    } catch (e) {
      return null;
    }
  }

  hashMD5(value: string): string {
    return CryptoJS.MD5(value).toString();
  }

  hashSHA256(value: string): string {
    return CryptoJS.SHA256(value).toString();
  }

}
