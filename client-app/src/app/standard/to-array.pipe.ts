import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toArray'
})
export class ObjectToArrayPipe implements PipeTransform {
  transform(object: any): any[] {
    const keys = Object.keys(object);
    const arr = keys.map(key => {
      return { key, value: object[key] };
    });
    return arr;
  }
}
