import { BuilderOutput, createBuilder } from '@angular-devkit/architect';
import { spawn } from 'child_process';
const { name } = require('../package.json');

export default createBuilder<{ root: string; }>((options, context) => {
  return new Promise<BuilderOutput>(resolve => {

    const ls = spawn(
      `node`,
      [
        `${context.workspaceRoot}/node_modules/${name}/develop/strapi-develop.js`,
        `--dir=${context.workspaceRoot}/${options.root}`,
        `--root=${context.workspaceRoot}`,
        `--name=${name}`
      ],
      // {
      //   env: {
      //     ...process.env,
      //     NODE_ENV: 'production'
      //   }
      // }
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

