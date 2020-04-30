import { BuilderOutput, createBuilder } from '@angular-devkit/architect';

export default createBuilder((options, context) => {
  return new Promise<BuilderOutput>(resolve => {
    console.log(options);
    resolve({ success: true });
  });
});
