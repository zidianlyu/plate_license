const fs = require('fs');

const MOCK_LICENSE_OBJECT = {
  license: '6LZD666', // string
  registered: 1622953087393, // UTC timestamp
  status: 'REGISTERED', // string
};
const LICENSES_FILE = './licenses.json';

class PlateLicense {
  // 构建class的时候第一个会跑的method
  constructor() {
    // 可以放class variable
    this.licenses = [MOCK_LICENSE_OBJECT];
    this.licenseSet = new Set();
    this.licenseSet.add(MOCK_LICENSE_OBJECT.license);
    this.licenseTree = {};
    this.addLicenseToTree(MOCK_LICENSE_OBJECT.license);
  }

  // i.e. '6LZD666' converts to '6'->'L'->'Z'->'D'->'6'->'6'->'6'
  addLicenseToTree(licenseNum) {
    let node = this.licenseTree; // get the point of the tree object [tree root]
    for (const letter of licenseNum) {
      if (!node[letter]) {
        node[letter] = {}; // 为了可以继续往下加东西
      }
      node = node[letter]; // 切换指针到下一级
    }
  }

  // search the count of license that starts with number k.
  searchLicensesByDFS(k) {
    let count = 0;
    const stack = [this.licenseTree[k]];
    while (stack.length) {
      const node = stack.pop();
      // check if empty object {}, also known as leaf node
      if (Object.keys(node).length === 0) {
        count++;
      } else {
        // if have children, add to stack.
        for (const childNode of Object.values(node)) {
          stack.push(childNode);
        }
        /**
        const childNodes = Object.values(node)
        for(let i = childNodes.length - 1; i >= 0; i++) {
          stack.push(childNodes[i])
        }
         */
      }
    }
    return count;
  }

  searchLicensesByBFS(k) {
    let count = 0;
    const queue = [this.licenseTree[k]];
    while (queue.length) {
      const node = queue.shift();
      // check if empty object {}, also known as leaf node
      if (Object.keys(node).length === 0) {
        count++;
      } else {
        // if have children, add to queue.
        for (const childNode of Object.values(node)) {
          queue.push(childNode);
        }
      }
    }
    return count;
  }


  printLicenseTree() {
    const treeInJSON = JSON.stringify(this.licenseTree, null, 2);
    console.log(treeInJSON);
    // fs.writeFileSync('./tree.json', treeInJSON);
  }

  getLicenses() {
    return this.licenses;
  }

  generateLicense() {
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

    // add licenseNumber into the tree
    this.addLicenseToTree(licenseNumber);

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
      newLicenseObjects.push(this.generateLicense());
    }
    return newLicenseObjects;
  }

  backupLicenses() {
    // fs.writeFile(<store_file_path>, <data>, <callback>)
    fs.writeFileSync(LICENSES_FILE, JSON.stringify(this.licenses, null, 2));
  }

  restoreLicenses() {
    return fs.readFile(LICENSES_FILE, 'utf8', (_, fileData) => {
      this.licenses = JSON.parse(fileData);
    });
  }

  removeLicensesFile() {
    return fs.unlink(LICENSES_FILE, () => {});
  }

  getLicense(licenseNum) {
    for (const licenseObj of this.licenses) {
      if (licenseObj.license === licenseNum) {
        return licenseObj;
      }
    }
    return null;
  }

  // i.e. this.updateLicenseStatus('6LZD666', 'SUSPENDED')
  updateLicenseStatus(licenseNum, updateStatus) {
    const licenseObj = this.getLicense(licenseNum);
    if (licenseObj) {
      licenseObj.status = updateStatus;
    }
  }

  unRegisterLicense(licenseNum) {
    // update license object array
    this.licenses = this.licenses.filter(
      (licenseObj) => licenseObj.license !== licenseNum
    );
    // update license set
    this.licenseSet.delete(licenseNum);
  }

  searchSuspiciousLicenses() {
    return this.licenses
      .filter((licenseObj) => {
        const licenseNum = licenseObj.license;
        let countX = 0;
        let count7 = 0;
        for (let i = 0; i < licenseNum.length; i++) {
          const letter = licenseNum[i];
          if (letter === 'X') countX++;
          if (letter === '7' && i >= 4) count7++;
        }
        return countX === 2 && count7 === 1;
      })
      .sort((a, b) => b.registered - a.registered);
  }

  getMagicLicenses() {
    // Step1: convert set to array
    return [...this.licenseSet]
      .filter((licenseNum) => {
        // Step2: extract the numbers part from license number.
        // i.e. '6LZD666' => '6666'
        // !iNaN => isNumber
        const numbers = licenseNum.split('').filter((el) => !isNaN(el));

        // Step3: calculate the sum from the numbers array.
        // i.e. '6666' => 24
        const sum = numbers.reduce((acc, num) => {
          acc += Number(num);
          return acc;
        }, 0);
        return sum === 21;
      })
      .sort();
  }

  getDoubleLicenses() {
    return [...this.licenseSet].filter((licenseNum) => {
      // Step 1: get the list of letters from each license
      // i.e. ['6LZD666'] => ['LZD']
      const letterPart = licenseNum.slice(1, 4);

      // Step 2: build the letter-count map
      // i.e. 'LZZ' => {'L': 1, 'Z': 2}
      const letterMap = letterPart.split('').reduce((acc, letter) => {
        acc[letter] = acc[letter] + 1 || 1;
        return acc;
      }, {});

      // Step3: check if any val (the 'count') equals to 2
      // i.e. Object.values({'L': 1, 'Z': 2}) => [1, 2]
      // [1, 2].some((count) => count === 2) gets true
      return Object.values(letterMap).some((count) => count === 2);
    });
  }

  getLuckyLicenses() {
    return [...this.licenseSet].filter((licenseNum) => {
      const letterPart = licenseNum.slice(1, 4);
      return new Set(letterPart.split('')).size === 1;
    });
  }

  getRoyalLicenses() {
    // Step 1: get lucky licenses and filter from them
    const licenseNumbers = this.getLuckyLicenses();

    // Step 2: get all the number parts (4 numbers)
    return licenseNumbers.filter((licenseNum) => {
      const numberParts = licenseNum
        .split('')
        .filter((letter) => !isNaN(letter));
      // Step 3: new Set(numbers).size <= 3
      return new Set(numberParts).size <= 3;
    });
  }
}

module.exports = PlateLicense;
