import { Component, inject } from '@angular/core';
import { Stats } from '../stats';

@Component({
  selector: 'app-stats',
  standalone: true,
  templateUrl: './stats-component.html',
})
export class StatsComponent { 

  stats = inject(Stats);

}