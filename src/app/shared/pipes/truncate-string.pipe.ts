import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncateString',
  standalone: false,
})
export class TruncateStringPipe implements PipeTransform {

  transform(value: string | null | undefined, limit: number = 30, completeWords: boolean = false, ellipsis: string = '…'): string {
    if (!value) return '';
    if (value.length <= limit) return value;

    let truncated = value.substring(0, limit);

    if (completeWords) {
      const lastSpace = truncated.lastIndexOf(' ');
      if (lastSpace > 0) {
        truncated = truncated.substring(0, lastSpace);
      }
    }

    return truncated + ellipsis;
  }

}
