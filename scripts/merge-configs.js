#!/usr/bin/env node

// scripts/merge-configs.js
// Merges YAML config files for build-time config generation


const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const merge = require('lodash.merge');

const usage = 'Usage: node merge-configs.js -o outputFile.json inputFiles.yaml...';
let verbose = false;

function parseArgs() {
  // Usage: node merge-configs.js -o outputFile.json inputFiles.yaml...
  const args = process.argv.slice(2);
  let outputFile = null;
  let format = null;
  const inputFiles = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '-h' || args[i] === '--help') {
      console.log(usage);
      process.exit(0);
    }
    if (args[i] === '-v' || args[i] === '--verbose') {
      verbose = true;
      continue;
    }
    if (args[i] === '-f' || args[i] === '--format') {
      format = args[i + 1];
      i++;
      continue;
    }
    if (args[i] === '-o' && i + 1 < args.length) {
      outputFile = args[i + 1];
      i++;
      continue;
    }

    inputFiles.push(args[i]);
  }

  if ( inputFiles.length === 0) {
    console.error(usage);
    console.error("No input files provided.");
    process.exit(1);
  }

  // Determine output format
  if (!format) {
    if (outputFile) {
      const ext = path.extname(outputFile).toLowerCase();
      if (ext === '.json') {
        format = 'json';
      } else if (ext === '.yaml' || ext === '.yml') {
        format = 'yaml';
      }
    } else {
      format = 'json';
    }
  }
  if (format !== 'json' && format !== 'yaml') {
    console.error(usage);
    console.error("Unsupported format: " + format);
    process.exit(1);
  }

  return { inputFiles, outputFile, format };
}

function readYaml(file) {
  if (verbose) {
    console.log(`Reading ${file}`);
  }
  if (!fs.existsSync(file)) return {};
  const content = fs.readFileSync(file, 'utf8');
  return yaml.load(content) || {};
}

function mergeConfigs(files) {
  if (files.length === 0) {
    throw new Error('No YAML files provided.');
  }
  let config = readYaml(files[0]);
  for (const file of files.slice(1)) {
    const override = readYaml(file);
    config = merge({}, config, override);
  }
  return config;
}

function getYamlFiles(files) {
  return files.filter(f => f.endsWith('.yaml') || f.endsWith('.yml') || f.endsWith('.json'));
}

function write(file, obj, format) {
  let output;
  if (format === 'yaml') {
    output = yaml.dump(obj);
  } else {
    output = JSON.stringify(obj, null, 2);
  }

  if (file) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, output);
    if(verbose) {
      console.log(`Wrote ${file}`);
    }
  } else {
    process.stdout.write(output + '\n');
  }
}

function main() {
  const { inputFiles, outputFile, format } = parseArgs();

  const yamlFiles = getYamlFiles(inputFiles);
  if (yamlFiles.length === 0) {
    console.error();
    process.exit(1);
  }
  const merged = mergeConfigs(yamlFiles);
  write(outputFile, merged, format);
}

main();