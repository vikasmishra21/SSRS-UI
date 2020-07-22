import { WebJobStatusPipe } from './web-job-status.pipe';

describe('WebJobStatusPipe', () => {
  it('create an instance', () => {
    const pipe = new WebJobStatusPipe();
    expect(pipe).toBeTruthy();
  });
});
