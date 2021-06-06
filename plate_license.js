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
  }

  getAllLicenses() {
    return this.licenses;
  }
}

// 创建一个class instance
const pl = new PlateLicense();

console.log(pl.getAllLicenses());
