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

describe('#3 Generate plate license', () => {
  describe('For license number', () => {
    const {license} = pl.generateNewLicense();
    it('should have 7 digits', () => {
      expect(license.length).toBe(7);
    });

    it('should have 4 numbers', () => {
      const numbers = license.split('').filter((item) => !isNaN(item));
      // i.e. '6LZD666' => ['6', '6', '6', '6']
      expect(numbers.length).toBe(4);
    });

    it('should have 3 letters in uppercase', () => {
      const letters = license.match(/[A-Z]/g);
      expect(letters.length).toBe(3);
    });
  });

  it('has register time defined', () => {
    const {registered} = pl.generateNewLicense();
    expect(registered).toBeDefined();
  });

  it('has status REGISTERED', () => {
    const {status} = pl.generateNewLicense();
    expect(status).toBe('REGISTERED');
  });

  it('updates the licenses variables in class', () => {
    pl.generateNewLicense();
    expect(pl.getAllLicenses().length).toBe(2);
  });
});
