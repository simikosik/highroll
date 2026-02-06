import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Blackjack } from './blackjack/blackjack';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'bj', component: Blackjack }
];
