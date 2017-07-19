#!/usr/bin/env node

const argv = require('minimist')(process.argv.slice(2));

const {
  mac2016,
  shotdir,
  tmpl,
  src,
  type,
  head,
  body,
  foot,
  sheet,
  hdrow,
  keycol,
  nosplit,
  noimg,
  cleanup,
  ph,
  dest,
} = argv;

module.exports = {
  options: {
    mac2016: mac2016 === 'true',
    shotDir: shotdir,
    tmpl,
    source: src,
    type,
    headNum: head,
    bodyNum: body,
    footNum: foot,
    sheet,
    headerRowNum: hdrow,
    keyCol: keycol,
    noSplit: nosplit === 'true',
    noImg: noimg === 'true',
    cleanUp: cleanup === 'true',
    placeholder: ph,
    dest,
  },
};
