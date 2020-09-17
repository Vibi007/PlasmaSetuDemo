import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'absVal' })
export class AbsValuePipe implements PipeTransform {
	transform(num: number, args?: any): any {
		if (num) {
			return Math.abs(num);
		}
		return '0';
	}
}
