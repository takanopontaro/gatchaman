const Base = require('gatchaman/src/base');

module.exports = class extends Base {
  get ext() {
    return 'xlsm';
  }

  get dirname() {
    return __dirname;
  }

  getAppleScript(method) {
    return `
tell application "Microsoft Excel"
  activate
  open "${this.paths.macro}"
  run VB macro "macro.xlsm!${method}"
end tell
`;
  }
};
