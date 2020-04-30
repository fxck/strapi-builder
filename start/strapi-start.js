#!/usr/bin/env node

'use strict';

const strapi = require('strapi');
const yargs = require('yargs');

const argv = yargs
  .option('dir', {
    description: 'strapi dir',
    type: 'string'
  })
  .argv;

return strapi({ dir: argv.dir }).start();

