import path from 'path';
import { Worker } from 'worker_threads';
import multiBar from '../../cli/multiProgressBar';
import mergeFile from '../mergeFiles';

interface IWorkersHandlingProps {
    numConnections: number;
    fileName: string;
    url: string;
    totalBytes: number;
    debug: boolean;
    directory: string;
}

const workersHandling = ({ numConnections, fileName, url, totalBytes, debug, directory }: IWorkersHandlingProps) => {
    if (!totalBytes) {
        numConnections = 1;
    }
    const maximumBytesPerConnection = Math.floor(totalBytes / numConnections);
    let numSuccessfulWorker = 0;
    const listOfWorkers: Worker[] = [];

    return new Promise<string>((resolve, reject) => {
        for (let i = 0; i < numConnections; i++) {
            const startBytes = i * maximumBytesPerConnection;
            const endBytes = i === numConnections - 1 ? '' : i * maximumBytesPerConnection + maximumBytesPerConnection - 1;
            const worker = new Worker(path.resolve(__dirname, './worker.js'));
            listOfWorkers.push(worker);
            worker.postMessage({
                id: i,
                fileName: `${fileName}-${i}`,
                url,
                endBytes,
                startBytes,
                directory,
            });
            const bytes = endBytes ? endBytes - startBytes : totalBytes - startBytes;
            const progressBar = debug ? multiBar.create(bytes, 0, { worker: i }) : undefined;
            worker.on('error', async (err) => {
                await Promise.all(listOfWorkers.map((worker) => worker.terminate()));
                reject(new Error(`Worker ${i} error:: ${err.message}`));
            });
            worker.on('message', async ({ type, value }) => {
                if (type === 'done') {
                    await worker.terminate();
                    progressBar?.update(progressBar.getTotal());
                    numSuccessfulWorker++;
                    if (numSuccessfulWorker >= numConnections) {
                        try {
                            const destinationFile = await mergeFile(fileName, numConnections, directory);
                            resolve(destinationFile);
                        } catch (err) {
                            let errMessage = 'Failed to merge files';
                            if (err instanceof Error) {
                                errMessage = err.message;
                            }
                            reject(new Error(errMessage));
                        }
                    }
                }
                if (type === 'chunk') {
                    progressBar?.increment(Number(value));
                }
            });
        }
    });
};

export default workersHandling;
