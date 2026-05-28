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
    if (this.service.showPopup()) {
      this.service.closePopup();
    } else {
      // close non-showPopup messages or mandatory ack
      this.service.popupMessage.set('');
      this.service.requireAck.set(false);
    }
  }
}