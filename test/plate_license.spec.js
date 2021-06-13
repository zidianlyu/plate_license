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

describe('#6 Research license', () => {
  it('detects default existing license object', () => {
    expect(pl.getLicense('6LZD666')).toEqual({
      license: '6LZD666', // string
      registered: 1622953087393, // UTC timestamp
      status: 'REGISTERED', // string
    });
  });

  it('return null for non-existing license', () => {
    expect(pl.getLicense('7XJP777')).toBe(null);
  });

  it('update the status to SUSPENDED', () => {
    pl.updateLicenseStatus('6LZD666', 'SUSPENDED');
    const licenseObj = pl.getLicense('6LZD666');
    expect(licenseObj).toBeDefined();
    expect(licenseObj.status).toBe('SUSPENDED');
  });

  it('will not update non-exist license', () => {
    pl.updateLicenseStatus('6LZD666', 'REGISTERED');
    const defaultCase = pl.getLicense('6LZD666');
    expect(defaultCase.status).toBe('REGISTERED');
    pl.updateLicenseStatus('7XJP777', 'REGISTERED');
    expect(defaultCase.status).toBe('REGISTERED');
  });
});

describe('#7 UnRegister license', () => {
  it('should work!', () => {
    expect(pl.licenses.length).toBe(1);
    expect(pl.licenseSet.size).toBe(1);
    pl.unRegisterLicense('6LZD666');
    expect(pl.licenses.length).toBe(0);
    expect(pl.licenseSet.size).toBe(0);
  });
});

describe('#9 Get suspicious licenses', () => {
  pl.batchGenerateLicenses(10000);
  const licenses = pl.searchSuspiciousLicenses();

  it('can get qualified suspicious licenses', () => {
    const randomLicense = pl._getRandomItemFromArray(licenses);
    if (randomLicense) {
      const licenseNum = randomLicense.license;
      const letters = licenseNum.slice(1, 4).split('');
      const last3Digits = licenseNum.slice(-3).split('');
      expect(letters.filter((item) => item === 'X').length).toBe(2);
      expect(last3Digits.filter((item) => item === '7').length).toBe(1);
    }
  });

  it('sorts in descending order', () => {
    if (licenses.length >= 2) {
      for (let i = 0; i < licenses.length - 1; i++) {
        const lo = licenses[i];
        const hi = licenses[i + 1];
        expect(lo.registered).not.toBeLessThan(hi.registered);
      }
    }
  });
});

describe('#12 For the stats-men', () => {
  it('can get the magic licenses (sum of num equal to 21)', () => {
    pl.batchGenerateLicenses(10000);
    const magicLicenses = pl.getMagicLicenses();
    for (const licenseNum of magicLicenses) {
      const sum =
        Number(licenseNum[0]) +
        Number(licenseNum[4]) +
        Number(licenseNum[5]) +
        Number(licenseNum[6]);
      expect(sum).toBe(21);
    }
  });
});
