import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Blackjack } from './blackjack/blackjack';
import { Blog } from './blog/blog';
import { About } from './about/about';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'bj', component: Blackjack },
    { path: 'about', component: About },
    { path: 'blog', component: Blog },
    { path: '**', redirectTo: '' }
];
