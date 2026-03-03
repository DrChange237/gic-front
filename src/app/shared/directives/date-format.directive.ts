import { formatDate } from "@angular/common";
import { Directive, HostListener, Self } from "@angular/core";
import { NgControl } from "@angular/forms";



@Directive({
    selector : 'input[type="date"]',
    standalone : true
})
export class DateFormatDirective{
    constructor(@Self() private ngControl: NgControl){}

    @HostListener('change', ['$event.target.value'])
    onInputChange(value:string){
        if(value){
            const date = new Date(value)
            const formatted = formatDate(date, 'dd/MM/yy', 'en-US')
            this.ngControl.control?.setValue(formatted, {emitEvent:false});
        }
    }
}