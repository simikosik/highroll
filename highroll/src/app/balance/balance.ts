import { Component } from '@angular/core';
import { balance, changeBalance } from './balance.store';

@Component({
  selector: 'app-balance',
  standalone: true,
  templateUrl: './balance.html',
  styleUrl: './balance.css'
})
export class Balance {
  readonly balance = balance;

  addTen = () => changeBalance(10);
  subTen = () => changeBalance(-10);
}