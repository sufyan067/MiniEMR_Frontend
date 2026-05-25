import { Directive, HostBinding, Input, OnChanges } from '@angular/core';

export const VITAL_RANGES: Record<string, { min: number; max: number; label: string }> = {
  bPSystolic:      { min: 90,   max: 140,  label: '90–140' },
  bPDiastolic:     { min: 60,   max: 90,   label: '60–90' },
  pulseRate:       { min: 60,   max: 100,  label: '60–100' },
  temperatureF:    { min: 97.0, max: 99.0, label: '97–99°F' },
  respiratoryRate: { min: 12,   max: 20,   label: '12–20' },
  bMI:             { min: 18.5, max: 24.9, label: '18.5–24.9' }
};

@Directive({
  selector: '[appVitalRange]',
  standalone: true
})
export class VitalRangeDirective implements OnChanges {
  @Input('appVitalRange') field = '';
  @Input() rangeValue: number | null | undefined = null;

  @HostBinding('class.vital-normal') isNormal = false;
  @HostBinding('class.vital-abnormal') isAbnormal = false;

  ngOnChanges(): void {
    const range = VITAL_RANGES[this.field];
    const v = this.rangeValue;
    if (!range || v === null || v === undefined) {
      this.isNormal = false;
      this.isAbnormal = false;
      return;
    }
    this.isNormal = v >= range.min && v <= range.max;
    this.isAbnormal = !this.isNormal;
  }

  get rangeLabel(): string {
    return VITAL_RANGES[this.field]?.label ?? '';
  }
}
