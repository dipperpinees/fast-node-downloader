import { Command } from 'commander';
import download from '../lib/start';
import * as colors from 'colors';

const startCommand = () => {
    const program = new Command();

    program
        .command('download')
        .description('Download file')
        .argument('<url>', 'URL to download')
        .option('-c, --connection <value>', 'Number of download connections')
        .option('-d, --directory <value>', 'Downloaded file directory')
        .action((url, options) => {
            const numConnections = options.connection;
            const directory = options.directory;

            download({ numConnections, url, directory, debug: true })
                .then((directory) => {
                    console.log(colors.green(`\nFile is downloaded at ${directory}`));
                    process.exit();
                })
                .catch((err: Error) => {
                    console.log(colors.red(`\n${err.message}`));
                    process.exit(1);
                });
        });
    program.parse();
};

export default startCommand;
