// Local preview launcher: runs `next start` (or `next dev` with --dev) from the project root,
// so content paths resolve correctly no matter where it is launched from.
const path = require('node:path');
const root = path.join(__dirname, '..');
process.chdir(root);
const mode = process.argv.includes('--dev') ? 'dev' : 'start';
process.argv = [process.argv[0], path.join(root, 'node_modules/next/dist/bin/next'), mode, '-p', '3000'];
require(path.join(root, 'node_modules/next/dist/bin/next'));
