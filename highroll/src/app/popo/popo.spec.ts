import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Popo } from './popo';

describe('Popo', () => {
  let component: Popo;
  let fixture: ComponentFixture<Popo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Popo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Popo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
