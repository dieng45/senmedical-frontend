import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatistiquesAdmin } from './statistiques-admin';

describe('StatistiquesAdmin', () => {
  let component: StatistiquesAdmin;
  let fixture: ComponentFixture<StatistiquesAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatistiquesAdmin],
    }).compileComponents();

    fixture = TestBed.createComponent(StatistiquesAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
