import { GaragewebPage } from './app.po';

describe('garageweb App', function() {
  let page: GaragewebPage;

  beforeEach(() => {
    page = new GaragewebPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
