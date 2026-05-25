import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'bmi',
  standalone: true
})
export class BmiPipe implements PipeTransform {
  transform(weightKg: number | null | undefined, heightCm: number | null | undefined): number | null {
    if (!weightKg || !heightCm || heightCm <= 0) return null;
    const heightM = heightCm / 100;
    return Math.round((weightKg / (heightM * heightM)) * 10) / 10;
  }
}
