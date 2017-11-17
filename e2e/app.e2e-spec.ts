import { WenteractPage } from './app.po';

describe('wenteract App', () => {
  let page: WenteractPage;

  beforeEach(() => {
    page = new WenteractPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
