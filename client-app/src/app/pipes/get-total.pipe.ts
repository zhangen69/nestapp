import { Pipe, PipeTransform } from '@angular/core';
import { of, from } from 'rxjs';
import { map, reduce } from 'rxjs/operators';

@Pipe({
    name: 'getTotal'
})
export class GetTotalPipe implements PipeTransform {
    transform(list: any[], pricePropName: string, quantityPropName: string): number {
        if (!list || list.length <= 0) {
            return 0;
        }

        let total = 0;

        from(list)
            .pipe(
                map(val => {
                    let price = val[pricePropName];
                    let qty = val[quantityPropName];

                    if (pricePropName.includes('.')) {
                        price = val;
                        pricePropName.split('.').forEach(splitedVakue => (price = price[splitedVakue]));
                    }

                    if (quantityPropName.includes('.')) {
                        qty = val;
                        quantityPropName.split('.').forEach(splitedVakue => (qty = qty[splitedVakue]));
                    }

                    return { price, qty };
                }),
                reduce((acc, val) => acc + val.price * val.qty, 0)
            )
            .subscribe(val => {
                total = val;
            });

        return total;
    }
}
