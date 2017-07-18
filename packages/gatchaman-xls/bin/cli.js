#!/usr/bin/env node

const util = require('gatchaman/bin/util');
const Gatchaman = require('..');

new Gatchaman(util.options).run();
