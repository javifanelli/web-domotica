import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'prespipe'
})
export class PresPipe implements PipeTransform {

  transform(presion: number): number {
    return (presion*0.0101972);
  }

}
