import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeckVisualizer } from './deck-visualizer';

describe('DeckVisualizer', () => {
  let component: DeckVisualizer;
  let fixture: ComponentFixture<DeckVisualizer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeckVisualizer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeckVisualizer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
