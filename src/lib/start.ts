import { Worker } from 'worker_threads';
import getFileDetails from './getFileDetails';
import * as path from 'path';
import mergeFile from './mergeFiles';
import isURL from './isURL';
import * as os from 'os';
import * as colors from 'colors';
import multiBar from '../cli/multiProgressBar';
import * as fs from 'fs';
import { saveDownloadDirectoryTemp } from './downloadDirectory';

interface IDownloadProps {
    numConnections: number;
    url: string;
    directory: string | undefined;
}

const download = async ({ numConnections = os.cpus().length, url, directory }: IDownloadProps) => {
    try {
        if (directory) {
            if (fs.existsSync(directory)) {
                saveDownloadDirectoryTemp(directory);
            } else {
                throw new Error(colors.red('Download path is not exists'));
            }
        }

        if (!isURL(url)) {
            throw new Error(colors.red('URL is not valid'));
        }

        const { totalBytes, fileName } = await getFileDetails(url);
        if (!totalBytes) {
            numConnections = 1;
        }
        const maximumBytesPerConnection = Math.floor(totalBytes / numConnections);
        let numSuccessfulWorker = 0;
        for (let i = 0; i < numConnections; i++) {
            const startBytes = i * maximumBytesPerConnection;
            const endBytes = i === numConnections - 1 ? '' : i * maximumBytesPerConnection + maximumBytesPerConnection - 1;
            const worker = new Worker(path.resolve(__dirname, './worker.js'));
            worker.postMessage({
                id: i,
                fileName: `${fileName}-${i}`,
                url,
                endBytes,
                startBytes,
            });
            const bytes = endBytes ? endBytes - startBytes : totalBytes - startBytes;
            const progressBar = multiBar.create(bytes, 0, { worker: i });
            worker.on('error', (err) => {
                console.log(colors.red(`\nWorker ${i} error:: ${err.message}`));
                process.exit(1);
            });
            worker.on('message', async ({ type, value }) => {
                if (type === 'done') {
                    progressBar.update(progressBar.getTotal());
                    numSuccessfulWorker++;
                    if (numSuccessfulWorker >= numConnections) {
                        try {
                            const destinationFile = await mergeFile(fileName, numConnections, directory);
                            console.log(colors.green(`\nFile downloaded at: ${destinationFile}`));
                            process.exit();
                        } catch (err) {
                            errorHandling(err);
                            process.exit(1);
                        }
                        
                    }
                }
                if (type === 'chunk') {
                    progressBar.increment(Number(value));
                }
            });
        }
    } catch (err) {
        errorHandling(err);
        process.exit(1);
    }
};

const errorHandling = (err: unknown) => {
    let errorMessage = 'Failed to download file';
    if (err instanceof Error) {
        errorMessage = err.message;
    }
    console.log(colors.red(`\nError:::, ${errorMessage}`));
}

export default download;
