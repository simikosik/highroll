import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BjCard } from './bjcard';

describe('Bjcard', () => {
  let component: BjCard;
  let fixture: ComponentFixture<BjCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BjCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BjCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
