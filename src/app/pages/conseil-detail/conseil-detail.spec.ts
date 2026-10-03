import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConseilDetail } from './conseil-detail';

describe('ConseilDetail', () => {
  let component: ConseilDetail;
  let fixture: ComponentFixture<ConseilDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConseilDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(ConseilDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
