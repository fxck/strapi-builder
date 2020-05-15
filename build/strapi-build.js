// #!/usr/bin/env node

// 'use strict';

// const path = require('path');
// const fs = require('fs-extra');
// const yargs = require('yargs');
// const _ = require('lodash');
// const { green, yellow } = require('chalk');
// // eslint-disable-next-line node/no-extraneous-require
// const strapiAdmin = require('strapi-admin');
// const loadConfigFile = require('../strapi-load-utils/load-config-files');
// const addSlash = require('../strapi-utils/addSlash');

// const buildCommand = async ({
//   clean,
//   optimization,
//   dir = process.cwd(),
//   outputPath
// }) => {
//   const env = process.env.NODE_ENV || 'development';

//   const envConfigDir = path.join(dir, 'config', 'environments', env);

//   if (!fs.existsSync(envConfigDir)) {
//     console.log(
//       `Missing environment config for env: ${green(env)}.\nMake sure the directory ${yellow(
//         `./config/environments/${env}`
//       )} exists`
//     );
//     process.exit(1);
//   }

//   const serverConfig = await loadConfigFile(envConfigDir, 'server.+(js|json)');

//   const adminPath = _.get(serverConfig, 'admin.path', '/admin');
//   const adminBackend = _.get(serverConfig, 'admin.build.backend', '/');

//   console.log(`Building your admin UI with ${green(env)} configuration ...`);

//   if (clean) {
//     await strapiAdmin.clean({ dir });
//   }

//   try {
//     await strapiAdmin
//       .build({
//         dir,
//         // front end build env is always production for now
//         env: 'production',
//         optimize: optimization,
//         options: {
//           backend: adminBackend,
//           publicPath: addSlash(adminPath),
//         },
//       });

//     if (outputPath) {
//       await fs.copySync(dir, outputPath);
//     }

//     process.exit();
//   }
//   catch (err) {
//     console.error(err);
//     process.exit(1);
//   }

// };

// const argv = yargs
//   .option('clean', {
//     description: 'should clean?',
//     type: 'boolean'
//   })
//   .option('dir', {
//     description: 'strapi dir',
//     type: 'string'
//   })
//   .argv;

// return buildCommand(argv);


'use strict';

const { green } = require('chalk');
// eslint-disable-next-line node/no-extraneous-require
const strapiAdmin = require('strapi-admin');
const { getConfigUrls } = require('strapi-utils');

const loadConfiguration = require('../core/app-configuration');
const addSlash = require('../utils/addSlash');
/**
 * `$ strapi build`
 */
const buildCommand = async ({
  clean,
  optimization,
  dir = process.cwd(),
  outputPath
}) => {
  const dir = process.cwd();
  const config = loadConfiguration(dir);

  const { serverUrl, adminPath } = getConfigUrls(config.get('server'), true);

  console.log(`Building your admin UI with ${green(config.environment)} configuration ...`);

  if (clean) {
    await strapiAdmin.clean({ dir });
  }

  return strapiAdmin
    .build({
      dir,
      // front end build env is always production for now
      env: 'production',
      optimize: optimization,
      options: {
        backend: serverUrl,
        publicPath: addSlash(adminPath),
      },
    })
    .then(() => {

      if (outputPath) {
        await fs.copySync(dir, outputPath);
      }

      process.exit();
    })
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
};

const argv = yargs
  .option('clean', {
    description: 'should clean?',
    type: 'boolean'
  })
  .option('dir', {
    description: 'strapi dir',
    type: 'string'
  })
  .argv;

return buildCommand(argv);
