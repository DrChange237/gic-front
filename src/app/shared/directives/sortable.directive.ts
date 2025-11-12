import {Directive, EventEmitter, HostListener, Input, Output} from '@angular/core';

export type SortDirection = 'asc' | 'desc' | '';
export interface SortEvent { column: string; direction: SortDirection; }
const rotate: { [key: string]: SortDirection } = { asc: 'desc', desc: '', '': 'asc' };

export interface SortEvent {
	column: string;
	direction: SortDirection;
}

@Directive({
	selector: 'th[sortable]',
	standalone: true,
	host: {
		'[class.asc]': 'direction === "asc"',
		'[class.desc]': 'direction === "desc"',
		'[style.cursor]': '"pointer"',
	},
})
export class NgbdSortableHeader {
	@Input() sortable: string = '';
	@Input() direction: SortDirection = '';
	@Output() sort = new EventEmitter<SortEvent>();

	@HostListener('click')
	rotate() {
		this.direction = rotate[this.direction];
		this.sort.emit({ column: this.sortable, direction: this.direction });
	}
}
