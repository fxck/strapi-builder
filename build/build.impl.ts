import { BuilderOutput, createBuilder } from '@angular-devkit/architect';
import { spawn } from 'child_process';
const { name } = require('../package.json');

export default createBuilder<{
  root: string;
  outputPath?: string;
}>((options, context) => {
  return new Promise<BuilderOutput>(resolve => {

    const ls = spawn(`node`, [
      `${context.workspaceRoot}/node_modules/${name}/build/strapi-build.js`,
      `--dir=${context.workspaceRoot}/${options.root}`,
      `--outputPath=${context.workspaceRoot}/${options.outputPath}`
    ]);

    ls.on('close', (code) => {
      console.log(`Exited with code ${code}`);
      resolve({ success: true });
    });

    ls.stderr.on('data', (data) => {
      console.log(`stderr: ${data}`);
      resolve({ success: false });
    });

    ls.on('error', (error) => {
      console.log(`error: ${error.message}`);
      resolve({ success: false });
    });

    ls.stdout.on('data', (data) => {
      console.log(`${data}`);
    });

  });

});

