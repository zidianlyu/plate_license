const MOCK_LICENSE_OBJECT = {
  license: '6LZD666', // string
  registered: 1622953087393, // UTC timestamp
  status: 'REGISTERED', // string
};

class PlateLicense {
  // 构建class的时候第一个会跑的method
  constructor() {
    // 可以放class variable
    this.licenses = [MOCK_LICENSE_OBJECT];
    this.licenseSet = new Set();
    this.licenseSet.add(MOCK_LICENSE_OBJECT.license);
  }

  getAllLicenses() {
    return this.licenses;
  }

  generateNewLicense() {
    const numbers = Array(10)
      .fill()
      .map((_, i) => i.toString());
    const letterCodes = Array(26)
      .fill()
      .map((_, i) => i);
    // ascii conversion => 'A', 'B'...'Z'
    const letters = letterCodes.map((code) => String.fromCharCode(code + 65));

    // generator helper
    const buildLicenseNumber = () =>
      this._getRandomItemFromArray(numbers) +
      this._getRandomItemFromArray(letters) +
      this._getRandomItemFromArray(letters) +
      this._getRandomItemFromArray(letters) +
      this._getRandomItemFromArray(numbers) +
      this._getRandomItemFromArray(numbers) +
      this._getRandomItemFromArray(numbers);

    // make sure the generated license number be unique.
    let licenseNumber = buildLicenseNumber();
    while (this.hasLicenseNumber(licenseNumber)) {
      licenseNumber = buildLicenseNumber();
    }

    // put the valid licenseNumber into the set
    this.licenseSet.add(licenseNumber);

    const licenseObject = {
      license: licenseNumber, // string
      registered: new Date().getTime(), // UTC timestamp
      status: 'REGISTERED', // string
    };
    this.licenses.push(licenseObject);
    return licenseObject;
  }

  hasLicenseNumber(license) {
    return this.licenseSet.has(license);
  }

  _getRandomItemFromArray(arr) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
  }

  batchGenerateLicenses(n) {
    const newLicenseObjects = [];
    while (n-- > 0) {
      newLicenseObjects.push(this.generateNewLicense());
    }
    return newLicenseObjects;
  }
}

module.exports = PlateLicense;
