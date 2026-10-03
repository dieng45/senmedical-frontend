import { TestBed } from '@angular/core/testing';
import { Conseil } from './conseil';

describe('Conseil', () => {
  let service: Conseil;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Conseil);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
