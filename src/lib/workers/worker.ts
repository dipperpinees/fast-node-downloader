import { parentPort } from 'worker_threads';
import httpDownload from '../httpDownload';

interface WorkerMessage {
    id: number;
    fileName: string;
    url: string;
    startBytes: number;
    endBytes: number | string;
    bytes: number;
    directory: string;
}

const sendMesage = (type: string, value: number | string = '') => {
    parentPort?.postMessage({ type, value });
};

parentPort?.on('message', async ({ fileName, url, startBytes, endBytes, directory }: WorkerMessage) => {
    await httpDownload({
        url,
        fileName,
        startBytes,
        endBytes,
        onData: (chunk) => sendMesage('chunk', chunk.length),
        directory,
    });

    sendMesage('done');
});
