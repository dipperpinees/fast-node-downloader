import { Command } from 'commander';
import download from '../lib/start';
import colors from 'colors';
import { OutgoingHttpHeaders } from 'http';

const startCommand = () => {
    const program = new Command();

    program
        .command('download')
        .description('Download file')
        .argument('<url>', 'URL to download')
        .option('-c, --connection <value>', 'Number of download connections')
        .option('-d, --directory <value>', 'Downloaded file directory')
        .option('-h, --headers <value>', 'An object containing HTTP headers to include in the request')
        .action(
            (url: string, options: { connection: number | undefined; directory?: string | undefined; headers: string }) => {
                const numConnections = options.connection;
                const directory = options.directory;
                const headers: OutgoingHttpHeaders = options.headers
                    ? (JSON.parse(options.headers) as OutgoingHttpHeaders)
                    : {};

                download(url, { numConnections, directory, debug: true, headers })
                    .then((directory) => {
                        console.log(colors.green(`\nFile is downloaded at ${directory}`));
                        process.exit();
                    })
                    .catch((err: Error) => {
                        console.log(colors.red(`\n${err.message}`));
                        process.exit(1);
                    });
            }
        );
    program.parse();
};

export default startCommand;
