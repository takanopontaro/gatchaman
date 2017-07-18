const Base = require('gatchaman/src/base');

module.exports = class extends Base {
  get ext() {
    return 'pptm';
  }

  get dirname() {
    return __dirname;
  }

  getAppleScript(method) {
    return `
tell application "Microsoft PowerPoint"
  activate
  open "${this.paths.macro}"
  run VB macro macro name "macro.pptm!${method}"
end tell
`;
  }
};
