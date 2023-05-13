import { Command } from 'commander';
import download from '../lib/start';

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

            download({ numConnections, url, directory });
        });
    program.parse();
};

export default startCommand;
