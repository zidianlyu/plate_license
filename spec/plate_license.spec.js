const PlateLicense = require('../plate_license');

describe('#1 Generate PlateLicense class', () => {
  it('successfully generate the instance', () => {
    const pl = new PlateLicense();
    expect(pl).toBeDefined();
  });
});
