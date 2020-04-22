import { TestBed } from '@angular/core/testing';

import { NewsEntryService } from './news-entry.service';

describe('NewsEntryService', () => {
  let service: NewsEntryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewsEntryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
