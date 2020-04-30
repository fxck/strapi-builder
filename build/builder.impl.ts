import { BuilderOutput, createBuilder } from '@angular-devkit/architect';
import * as childProcess from 'child_process';

export default createBuilder<any>((options, context) => {
  context.reportStatus(`Executing "${options.command}"...`);
  const child = childProcess.spawn(options, options.args, { stdio: 'pipe' });

  child.stdout.on('data', (data) => {
    context.logger.info(data.toString());
  });
  child.stderr.on('data', (data) => {
    context.logger.error(data.toString());
  });

  return new Promise<BuilderOutput>(resolve => {
    context.reportStatus(`Done.`);
    child.on('close', code => {
      resolve({ success: code === 0 });
    });
  });
});
