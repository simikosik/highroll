import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserData } from '../userdata';
import { AuthService } from '../auth';
import { Stats } from '../stats';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile {

  userData = inject(UserData);
  auth = inject(AuthService);
  stats = inject(Stats);

  constructor() {
    this.userData.loadUserData();
  }

  async logout() {
    await this.auth.logout();
  }

}