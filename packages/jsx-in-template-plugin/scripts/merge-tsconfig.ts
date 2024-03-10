import { join } from 'node:path';

import { findWorkspaceDir } from '@pnpm/find-workspace-dir';
import { findUp } from 'find-up';

const args = process.argv.slice(2);

const pnpmWorkspaceDir = await findWorkspaceDir(process.cwd());
const workspaceNodeModulesDir = pnpmWorkspaceDir ? join(pnpmWorkspaceDir, 'node_modules') : undefined;
const localNodeModulesDir = await findUp('node_modules', { type: 'directory' });






//const entrypoint =


