import { BuilderOutput, createBuilder } from '@angular-devkit/architect';
import { spawn } from 'child_process';

export default createBuilder((options, context) => {
  return new Promise<BuilderOutput>(resolve => {
    console.log(options, context);
    const ls = spawn('./node_modules/.bin/strapi', [ 'build' ]);

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

