#!/usr/bin/env node

const argv = require('minimist')(process.argv.slice(2));

const {
  mac2016,
  shotdir,
  tmpl,
  src,
  type,
  sheet,
  hdrow,
  keycol,
  nosplit,
  noimg,
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
    sheet,
    headerRowNum: hdrow,
    keyCol: keycol,
    noSplit: nosplit === 'true',
    noImg: noimg === 'true',
    placeholder: ph,
    dest,
  },
};
