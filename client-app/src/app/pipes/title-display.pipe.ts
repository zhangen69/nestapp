import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'titleDisplay'
})
export class TitleDisplayPipe implements PipeTransform {

  // Reference: https://stackoverflow.com/questions/4149276/javascript-camelcase-to-regular-form
  transform(value: string, args?: any): any {
    return value
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase());
  }

}
