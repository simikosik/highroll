import { Component, inject } from '@angular/core';
import { UserData } from '../userdata';

@Component({
  selector: 'app-balance',
  standalone: true,
  templateUrl: './balance.html',
  styleUrl: './balance.css'
})
export class Balance {
  private userData = inject(UserData);
  readonly balance = this.userData.balance;

  addTen = () => this.userData.updateBalance(10);
  subTen = () => this.userData.updateBalance(-10);
}