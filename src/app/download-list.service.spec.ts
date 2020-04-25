import { TestBed } from '@angular/core/testing';

import { DownloadListService } from './download-list.service';

describe('DownloadListService', () => {
  let service: DownloadListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DownloadListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
