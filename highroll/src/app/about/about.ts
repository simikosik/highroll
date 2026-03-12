import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './about.html',
  styleUrl: './about.css'
})
export class About {

  features = [
    {
      title: 'Modern Architecture',
      text: 'Application is built with modern Angular standalone architecture and clean component structure.'
    },
    {
      title: 'Performance Focused',
      text: 'Optimized for speed and responsiveness with lightweight UI and efficient rendering.'
    },
    {
      title: 'User Friendly',
      text: 'Interface designed with simplicity and clarity so users can navigate effortlessly.'
    },
    {
      title: 'Scalable Design',
      text: 'Project structure allows easy expansion and feature growth in the future.'
    }
  ];
}