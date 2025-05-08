import { TestBed } from '@angular/core/testing';

import { MaskaService } from './maska.service';

describe('MaskaService', () => {
  let service: MaskaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MaskaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
