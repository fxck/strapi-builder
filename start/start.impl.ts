import { BuilderOutput, createBuilder } from '@angular-devkit/architect';
import { spawn } from 'child_process';
const { name } = require('../package.json');

export default createBuilder<{ root: string; }>((options, context) => {
  return new Promise<BuilderOutput>(resolve => {

    const ls = spawn(`node`, [ `${context.workspaceRoot}/node_modules/${name}/start/strapi-start.js` ]);

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

