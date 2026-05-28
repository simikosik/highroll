import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserData } from '../userdata';
import { AuthService } from '../auth';
import { Stats, MatchHistoryEntry } from '../stats';

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
  history = this.stats.history;
  selectedTab = signal<'overview' | 'history'>('overview');

  constructor() {
    this.userData.loadUserData();
  }

  setTab(tab: 'overview' | 'history') {
    this.selectedTab.set(tab);
  }

  formatDate(timestamp: Date) {
    return new Intl.DateTimeFormat('default', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(timestamp);
  }

  async logout() {
    await this.auth.logout();
  }

}