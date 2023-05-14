import fs from 'fs';
import os from 'os';
import { getDownloadDirectory, saveDownloadDirectoryTemp } from './downloadDirectory';
import getFileDetails from './getFileDetails';
import isURL from './isURL';
import workersHandling from './workers/workersHandling';

interface IDownloadProps {
    numConnections: number;
    url: string;
    directory: string | undefined;
    debug: boolean;
}

const download = async ({ numConnections = os.cpus().length, url, directory, debug = false }: IDownloadProps) => {
    if (directory) {
        if (fs.existsSync(directory)) {
            saveDownloadDirectoryTemp(directory);
        } else {
            throw new Error('Download path is not exists');
        }
    } else {
        directory = getDownloadDirectory();
    }

    if (!isURL(url)) {
        throw new Error('URL is not valid');
    }

    const { totalBytes, fileName } = await getFileDetails(url);

    return workersHandling({ debug, directory, fileName, numConnections, totalBytes, url });
};

export default download;
