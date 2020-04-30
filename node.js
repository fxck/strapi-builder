const { spawn } = require('child_process');

const ls = spawn('./node_modules/.bin/strapi', ['build']);

ls.on('close', (code) => {
  console.log(`Exited with code pica ${code}`);
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
