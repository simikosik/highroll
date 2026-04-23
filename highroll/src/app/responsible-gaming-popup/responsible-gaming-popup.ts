import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResponsibleGamingService } from '../responsible-gaming.service';

@Component({
  selector: 'app-responsible-gaming-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './responsible-gaming-popup.html',
  styleUrl: './responsible-gaming-popup.css'
})
export class ResponsibleGamingPopup {
  service = inject(ResponsibleGamingService);

  close() {
    this.service.closePopup();
  }
}