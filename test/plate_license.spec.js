const PlateLicense = require('../plate_license');
let pl = new PlateLicense();

// This function will be called before running every test.
beforeEach(() => {
  pl = new PlateLicense();
});

describe('#1 Generate PlateLicense class', () => {
  it('successfully generate the instance', () => {
    expect(pl).toBeDefined();
  });
});

describe('#2 Track records', () => {
  it('successfully get all plate licenses', () => {
    expect(pl.getAllLicenses().length).toBe(1);
  });
});
