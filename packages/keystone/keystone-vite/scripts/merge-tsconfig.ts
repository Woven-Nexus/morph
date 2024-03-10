import { writeFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';

import {
	getTSConfigFromModule, getTSConfigFromPath,
	mergeJson, parseArgsToObject, type TSConfig,
} from './script-utils.js';


interface Arguments extends Partial<{
	config: string;
	outFile: string;
}> {}


const { config, outFile } = parseArgsToObject<Arguments>(process.argv.slice(2));
if (!config)
	throw new Error('Missing config argument.');
if (!outFile)
	throw new Error('Missing outFile argument.');


const localDir = process.cwd();


const entrypointPath = join(resolve(localDir, dirname(config)), basename(config));
const tsConfig = getTSConfigFromPath(entrypointPath);
if (!tsConfig)
	throw new Error('Could not get initial tsconfig.');


const tsConfigChain: TSConfig[] = [ tsConfig ];

let currentTsConfig: TSConfig | undefined = tsConfig;
while (currentTsConfig?.extends) {
	currentTsConfig = getTSConfigFromModule(currentTsConfig.extends);
	tsConfigChain.unshift(currentTsConfig);
}


const merged = mergeJson(...tsConfigChain);
delete merged.extends;

const outPath = join(resolve(localDir, dirname(outFile), basename(outFile)));
writeFileSync(outPath, JSON.stringify(merged, undefined, 3));
