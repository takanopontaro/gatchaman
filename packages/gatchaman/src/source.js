const fs = require('fs');
const _ = require('lodash');
const Je = require('jsonify-excel');

module.exports = class Source {
  constructor(source, type, sheet, headerRowNum, keyCol) {
    this.type = type;
    this.shotList = [];
    switch (type) {
      case 'excel':
        this.parseExcel(source, sheet, headerRowNum, keyCol);
        break;
      case 'text':
        this.parseText(source);
        break;
      case 'stdin':
        this.parseStdin(source);
        break;
      default:
        throw new Error('unknown source type detected.');
    }
  }

  convertStr2List(str) {
    const list = str.trim().split(/[\r\n]+/).map(v => v.trim());
    return _.uniq(_.compact(list));
  }

  parseExcel(filePath, sheet, headerRowNum, keyCol) {
    const je = new Je(filePath);
    this.sheetNum = _.isNumber(sheet)
      ? sheet
      : je.book.SheetNames.findIndex(v => v === sheet);
    this.headerRowNum = headerRowNum;
    this.startRowNum = headerRowNum + 1;
    this.keyColNum = je.xlsx.utils.decode_col(keyCol);
    this.shotList = je.toJson({
      automap: { headerRowNum },
      sheet: this.sheetNum,
      check: keyCol,
    });
  }

  parseText(filePath) {
    const buf = fs.readFileSync(filePath, 'utf8');
    this.shotList = this.convertStr2List(buf);
  }

  parseStdin(text) {
    this.shotList = this.convertStr2List(text);
  }
};
