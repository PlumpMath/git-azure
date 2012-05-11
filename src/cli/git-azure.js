#!/usr/bin/env node

var program = require('commander')
    , fs = require('fs')
    , path = require('path')
    , util = require('util')
    , colors = require('colors');

var oldError = console.error;
console.error = function (thing) {
    if (typeof thing === 'string')
        thing = thing.red;
    return oldError.call(this, thing);
}

program.version(require(path.resolve(__dirname, '../../package.json')).version);

program.command('init')
    .description('One-time initialization of a Windows Azure Service associated with this Git repo.'.cyan)
    .option('-g, --publishSettings <file>', '[required] location of the *.publishSettings file for managing the specified subscription')
    .option('-n, --serviceName <name>', '[required] name of the Windows Azure service to create')
    .option('-u, --username <username>', '[required] username for administration and RDP connection to the Windows Azure service')
    .option('-p, --password <password>', '[required] password for administration and RDP connection to the Windows Azure service')
    .option('-s, --subscription <id|name>', '[optional] Windows Azure subscription ID to create the service under (defaults to first listed in *.publishSettings)')    
    .option('-a, --storageAccountName <name>', '[optional] name of the Windows Azure Blob Storage account to use')
    .option('-f, --force', '[optional] override hosted services and blobs if they already exist')
    .option('-l, --serviceLocation <location>', '[optional] location of the Windows Azure datacenter to host the service in (defaults to Anywhere US)')
    .option('-i, --instances <number>', '[optional] number of instances of Windows Azure Worker Role to create')
    .option('-b, --blobContainerName <name>', '[optional] name of the Windows Azure Blob Storage contaniner to create or use')
    .option('-r, --remote <name>', '[optional] remote name to push git-azure runtime scaffolding to (defaults to origin)')
    .option('-t, --branch <name>', '[optional] branch name to push git-azure runtime scaffolding to (defaults to master)')
    .option('-c, --postReceive <url_path>', '[optional] obfuscated URL path for the post receive hook endpoint')
    .option('-o, --noCache', '[optional] do not cache settings in Git config after successful completion')
    .action(require('./commands/init.js').action);

program.command('app <name>')
    .description('Manage node.js applications associated with this Git repo.'.cyan)
    .option('-g, --git <url>', 'the optional URL of the external git repo where the application resides to register as a submodule under apps/<name>')
    .option('-t, --host <hostname>', 'the hostname the app is addressable with')
    .option('-e, --entry <file>', 'the relative path to the main application file; default apps/<name>/server.js')
    .option('-s, --ssl <mode>', 'one of [required|allowed|disallowed]; default disallowed')
    .option('-c, --cert <blob_name>', 'the Windows Azure Blob name with PKCS#7 encoded (PEM) X.509 certificate for SSL')
    .option('-k, --key <blob_name>', 'the Windows Azure Blob name with PKCS#7 encoded (PEM) private key for SSL')
    .option('-d, --delete', 'if --host specified, delete the host entry only; otherwise delete the entire application')
    .action(require('./commands/app.js').action);

program.command('blob')
    .description('Manipulate data in Azure Blob Storage.'.cyan)
    .option('-p, --put <name>', 'add or override data in blob storage')
    .option('-g, --get <name>', 'get data from blob storage')
    .option('-d, --delete <name>', 'delete data from blob storage')
    .option('-l, --list', 'list blobs in blob storage')
    .option('-f, --file <name>', 'optionally use with --get or --put options to indicate file to save to or read from')
    .option('-c, --content <text>', 'specifies content of the blob for --put; --content takes precedence over --file')
    .option('-v, --verbose, ', 'more verbose output')
    .option('-a, --storageAccountName <name>', '[required] name of the Windows Azure Blob Storage account to use')
    .option('-k, --storageAccountKey <key>', '[required] access key for the specified Windows Azure Blob Storage account')
    .option('-b, --blobContainerName <name>', '[required] name of the Windows Azure Blob Storage contaniner to create or use')
    .action(require('./commands/blob.js').action);

program.command('restart')
    .description('Restart the Windows Azure service associated with this Git repo.'.cyan)
    .option('-s, --subscription <id>', 'Windows Azure subscription ID to create the service under')
    .option('-p, --publishSettings <file>', 'location of the *.publishSettings file for managing the specified subscription')
    .option('-n, --serviceName <name>', 'name of the Windows Azure service to create')
    .option('-r, --reboot', 'hard reboot the Windows Azure service rather then just recycle node.js applications')
    .option('-q, --quiet', 'succeed or fail without showing prompts')
    .action(function (cmd) {
        console.log('restart: ', cmd);
    });

program.command('destroy')
    .description('Destroy the Windows Azure service associated with this Git repo.'.cyan)
    .option('-s, --subscription <id>', 'Windows Azure subscription ID to create the service under (defaults to first listed in *.publishSettings)')
    .option('-p, --publishSettings <file>', 'location of the *.publishSettings file for managing the specified subscription')
    .option('-a, --storageAccountName <name>', 'name of the Windows Azure Blob Storage account to use')
    .option('-k, --storageAccountKey <key>', 'access key for the specified Windows Azure Blob Storage account')
    .option('-n, --serviceName <name>', 'name of the Windows Azure service to create')
    .option('-b, --blobContainerName <name>', 'name of the Windows Azure Blob Storage contaniner to delete  ')
    .option('-q, --quiet', 'succeed or fail without showing prompts')
    .action(function (cmd) {
        console.log('destroying: ', cmd);
    });

if (process.argv.length == 2)
    program.parse(['', '', '-h']);
else
    program.parse(process.argv);
