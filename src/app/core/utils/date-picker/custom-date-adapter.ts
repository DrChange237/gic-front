import { Injectable } from '@angular/core';
import { NgbDateAdapter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class CustomDateAdapter extends NgbDateAdapter<string> {

  fromModel(value: string): NgbDateStruct | null {
    if (!value) return null;

    const [year, month, day] = value.split('-');
    return { year: parseInt(year, 10), month: parseInt(month, 10), day: parseInt(day, 10) };
  }

  toModel(date: NgbDateStruct | null): string | null {
    if (date === null) { return null; }
    return `${date.year}-${this.padNumber(date.month)}-${this.padNumber(date.day)}`;
  }

  private padNumber(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }
}
