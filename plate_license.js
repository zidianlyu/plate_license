class PlateLicense {
  // 构建class的时候第一个会跑的method
  constructor() {
    // 可以放class variable
    this.licenses = [];
  }
}

// 创建一个class instance
const pl = new PlateLicense();
// 使用class里面的variable
console.log(pl.licenses);
