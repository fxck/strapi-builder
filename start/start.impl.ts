import { BuilderOutput, createBuilder } from '@angular-devkit/architect';
import { spawn } from 'child_process';
const { name } = require('../package.json');

export default createBuilder<{ devRoot: string; distRoot: string; }>((options, context) => {
  return new Promise<BuilderOutput>(resolve => {

    const file = context.target.configuration === 'production'
    ? `${context.workspaceRoot}/node_modules/${name}/start/strapi-start.js`
    : `${context.workspaceRoot}/node_modules/${name}/start/strapi-develop.js`;

    const realRoot = context.target.configuration === 'production'
        ? options.distRoot
        : options.devRoot;

    const ls = spawn(
      `node`,
      [
        file,
        `--dir=${context.workspaceRoot}/${realRoot}`,
        `--root=${context.workspaceRoot}`,
        `--name=${name}`
      ],
      {
        env: {
          ...process.env,
          NODE_ENV: context.target.configuration === 'production' ? 'production' : 'development'
        }
      }
    );

    ls.on('close', (code) => {
      console.log(`Exited with code ${code}`);
      resolve({ success: true });
    });

    ls.stderr.on('data', (data) => {
      console.log(`stderr: ${data}`);
    });

    ls.on('error', (error) => {
      console.log(`error: ${error.message}`);
    });

    ls.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });

  });

});

