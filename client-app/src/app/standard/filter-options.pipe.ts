import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterOptions'
})
export class FilterOptionsPipe implements PipeTransform {
  transform(options: any[], value: any, refName: string): any {
    if (!options) {
      return;
    }

    if (!value) {
      return options;
    }

    switch(typeof value) {
      case 'object':
          value = value[refName];
          break;
      case 'string':
        if (!refName) {
          return options.filter(option => option.toLowerCase().includes(value.toLowerCase()));
        }
        break;
      case 'boolean':
        return options.filter(option => option[refName] === value);
    }

    // if (typeof value === 'object') {
    //   value = value[refName];
    // }

    // if (!refName && typeof value === 'string') {
    //   return options.filter(option => option.toLowerCase().includes(value.toLowerCase()));
    // }

    return options.filter(option => option[refName].toLowerCase().includes(value.toLowerCase()));
  }
}
