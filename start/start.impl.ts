import { BuilderOutput, createBuilder } from '@angular-devkit/architect';
import { spawn } from 'child_process';
const { name } = require('../package.json');

export default createBuilder<{ root: string; prod: boolean; }>((options, context) => {
  return new Promise<BuilderOutput>(resolve => {

    const file = options.prod
      ? `${context.workspaceRoot}/node_modules/${name}/start/strapi-start.js`
      : `${context.workspaceRoot}/node_modules/${name}/start/strapi-develop.js`

    const ls = spawn(
      `node`,
      [
        file,
        `--dir=${context.workspaceRoot}/${options.root}`,
        `--root=${context.workspaceRoot}`,
        `--name=${name}`
      ],
      {
        env: {
          ...process.env,
          NODE_ENV: options.prod ? 'production' : 'development'
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

