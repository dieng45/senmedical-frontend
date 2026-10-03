import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UtilisateursAdmin } from './utilisateurs-admin';

describe('UtilisateursAdmin', () => {
  let component: UtilisateursAdmin;
  let fixture: ComponentFixture<UtilisateursAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UtilisateursAdmin],
    }).compileComponents();

    fixture = TestBed.createComponent(UtilisateursAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
