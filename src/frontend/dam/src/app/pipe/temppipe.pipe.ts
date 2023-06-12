import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'temppipe'
})
export class TempPipe implements PipeTransform {

  transform(temperatura: number): number {
    return ((temperatura*9/5)+5);
  }

}
