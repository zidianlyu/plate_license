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
    expect(pl.getLicenses().length).toBe(1);
  });
});

describe('#3 Generate plate license', () => {
  describe('For license number', () => {
    const {license} = pl.generateLicense();
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
    const {registered} = pl.generateLicense();
    expect(registered).toBeDefined();
  });

  it('has status REGISTERED', () => {
    const {status} = pl.generateLicense();
    expect(status).toBe('REGISTERED');
  });

  it('updates the licenses variables in class', () => {
    pl.generateLicense();
    expect(pl.getLicenses().length).toBe(2);
  });
});

describe('#3 License generator essential', () => {
  it('can generate 50k plate license functionally', () => {
    const COUNT = 50000;
    for (let i = 0; i < COUNT; i++) {
      pl.generateLicense();
    }
    expect(pl.getLicenses().length).toBe(50001);
    expect(pl.licenseSet.size).toBe(50001);
  });
});

describe('#4 Batch generate licenses', () => {
  it('can generate n licenses at a time', () => {
    expect(pl.getLicenses().length).toBe(1);
    const newLicenses = pl.batchGenerateLicenses(4);
    expect(newLicenses.length).toBe(4);
    expect(pl.licenseSet.size).toBe(5);
  });
});

describe('#5 Anti-hack', () => {
  it('can backup all licenses', () => {
    pl.batchGenerateLicenses(100);
    pl.backupLicenses();
    pl.removeLicensesFile();
  });

  it('can restore all licenses', async () => {
    // Step 1: Default
    expect(pl.getLicenses().length).toBe(1);
    // Step 2: Add samples
    pl.batchGenerateLicenses(10);
    expect(pl.getLicenses().length).toBe(11);
    const storedLicenses = pl.getLicenses();
    // Step 3: Backup
    pl.backupLicenses();
    // Step 4: Mock system crush
    pl = new PlateLicense();
    expect(pl.getLicenses().length).toBe(1);
    // Step 5: Restore everything
    await pl.restoreLicenses();
    expect(pl.getLicenses().length).toBe(11);
    const restoreLicenses = pl.getLicenses();
    expect(storedLicenses).toEqual(restoreLicenses);
    pl.removeLicensesFile();
  });
});
