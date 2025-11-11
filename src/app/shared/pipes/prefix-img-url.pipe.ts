import { Pipe, PipeTransform } from '@angular/core';
import {BaseApiService} from "../../core/services/base-api.service";

@Pipe({
    name: 'prefixImgUrl',
    standalone: false
})
export class PrefixImgUrlPipe implements PipeTransform {
    imageBaseUrl: string = this.baseApiUrl.resolveImgUrl() + '/files/'

    constructor(private baseApiUrl: BaseApiService) {}
    transform(value: string): any {
        return this.imageBaseUrl + value;
    }
}
