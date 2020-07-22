import { SSRSUIPage } from './app.po';

describe('ssrs-ui App', () => {
  let page: SSRSUIPage;

  beforeEach(() => {
    page = new SSRSUIPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
