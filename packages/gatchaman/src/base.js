const path = require('path');
const os = require('os');
const fs = require('fs-extra');
const chokidar = require('chokidar');
const applescript = require('applescript');
const _ = require('lodash');
const Source = require('./source');

module.exports = class {
  get defaultOptions() {
    return {
      mac2016: false,
      shotDir: null,
      tmpl: null,
      source: null,
      type: null,
      headNum: 0,
      bodyNum: 1,
      footNum: 2,
      sheet: 0,
      headerRowNum: 0,
      keyCol: 'A',
      noSplit: true,
      noImg: true,
      cleanUp: true,
      placeholder: 1,
      dest: null,
    };
  }

  constructor(options) {
    this.options = _.merge({}, this.defaultOptions, options);
    const { source, type, sheet, headerRowNum, keyCol } = this.options;
    this.source = new Source(source, type, sheet, headerRowNum, keyCol);
    this.id = Date.now();
    this.paths = { tempDir: this.getTempDir() };
  }

  getTempDir() {
    let dir;
    if (this.options.mac2016) {
      const appDir = 'UBF8T346G9.Office';
      const { username } = os.userInfo();
      dir = `/Users/${username}/Library/Group Containers/${appDir}/${this.id}`;
    } else {
      dir = `${os.tmpdir()}/${this.id}`;
    }
    fs.mkdirSync(dir);
    return dir;
  }

  copyShotDir() {
    this.paths.shotDir = `${this.paths.tempDir}/shots`;
    fs.copySync(this.options.shotDir, this.paths.shotDir);
  }

  copyTmpl() {
    const tmpl = this.options.tmpl;
    const info = path.parse(tmpl);
    this.paths.tmpl = `${this.paths.tempDir}/tmpl${info.ext}`;
    fs.copySync(tmpl, this.paths.tmpl);
  }

  get ext() {
    return '';
  }

  get dirname() {
    return '';
  }

  copyMacro() {
    this.paths.macro = `${this.paths.tempDir}/macro.${this.ext}`;
    fs.copySync(`${this.dirname}/macro.${this.ext}`, this.paths.macro);
  }

  copySource() {
    const src = this.options.source;
    if (this.options.type !== 'stdin') {
      const info = path.parse(src);
      this.paths.source = `${this.paths.tempDir}/source${info.ext}`;
      fs.copySync(src, this.paths.source);
    } else {
      this.paths.source = `${this.paths.tempDir}/source.txt`;
      fs.writeFileSync(this.paths.source, src, 'utf8');
    }
  }

  saveInfo() {
    const { tmpl, source } = this.paths;
    const {
      placeholder,
      noSplit,
      noImg,
      cleanUp,
      headNum,
      bodyNum,
      footNum,
    } = this.options;
    const {
      type,
      sheetNum,
      headerRowNum,
      startRowNum,
      keyColNum,
    } = this.source;
    const data = `
${tmpl}
${source}
${+noImg}
${+noSplit}
${+cleanUp}
${placeholder}
${headNum + 1}
${bodyNum + 1}
${footNum + 1}
${type === 'excel' ? sheetNum + 1 : 0}
${type === 'excel' ? headerRowNum + 1 : 0}
${type === 'excel' ? startRowNum + 1 : 0}
${type === 'excel' ? keyColNum + 1 : 0}
`;
    fs.writeFileSync(`${this.paths.tempDir}/info.txt`, data.trim());
  }

  copyFiles() {
    this.copyShotDir();
    this.copyTmpl();
    this.copyMacro();
    this.copySource();
    this.saveInfo();
  }

  getAppleScript(method) {
    return '';
  }

  runOnMac() {
    const method = this.source.type === 'excel' ? 'runExcel' : 'runText';
    const script = this.getAppleScript(method);
    applescript.execString(script, err => {
      if (err) {
        console.error(err);
      }
    });
  }

  runOnWin() {}

  watch() {
    const watchDir = this.paths.tempDir;
    const watcher = chokidar
      .watch(watchDir, { awaitWriteFinish: true })
      .on('add', filePath => {
        if (/see-you-again/.test(filePath)) {
          fs.copySync(this.paths.tmpl, this.options.dest);
          fs.removeSync(watchDir);
          console.log('ok');
        }
      })
      .on('unlinkDir', () => {
        watcher.close();
      });
  }

  run() {
    this.copyFiles();
    if (os.platform() === 'darwin') {
      this.runOnMac();
    } else {
      this.runOnWin();
    }
    this.watch();
  }
};
