import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchFilter'
})
export class SearchFilterPipe implements PipeTransform {

  transform(items: any[], value: string): any {
    if (!items) return [];
    if (!value) return items;
    return items.filter(function (node) {
      var found = false;
      for (var key in node) {
        if (node[key]) {
          let searchResult = node[key].toString().toLowerCase().indexOf(value.toLowerCase());
          if (searchResult > -1) {
            found = true;
            break;
          }
        }
      }
      return found;
    });
    // return items.filter(it => it[field].toString().toLowerCase().indexOf(value.toLowerCase()) > -1);
  }

}
