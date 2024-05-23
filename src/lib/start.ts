import { OutgoingHttpHeaders } from 'http';
import os from 'os';
import multiBar from '../cli/multiProgressBar';
import getFileDetails from './getFileDetails';
import httpDownload from './httpDownload';
import isURL from './isURL';
import mergeFile from './mergeFiles';
import getDownloadDirectory from './downloadDirectory';

interface IDownloadProps {
    numConnections?: number;
    directory?: string;
    debug?: boolean;
    headers?: OutgoingHttpHeaders;
}

/**
 * Download a file from a URL to a specified destination on disk.
 * @param {string} url - The URL to download from.
 * @param {DownloadOptions} [options] - Optional additional download options.
 *      @param {number} [options.headers] - Additional headers to use for the download request.
 *      @param {number} [options.directory] -  The local destination path to save the file to.
 *      @param {boolean} [options.debug] - Log download progress. Default is false.
 *      @param {number} [options.numConnections] - The number of parallel connections to use for the download. Default is cpu multiplier.
 * @returns {Promise<string>} A Promise that resolves when the download is complete.
 */
const download = async (
    url: string,
    {
        numConnections = os.cpus().length,
        directory = getDownloadDirectory(),
        debug = false,
        headers = {},
    }: IDownloadProps = {}
) => {
    if (!isURL(url)) {
        throw new Error('URL is not valid');
    }

    const { totalBytes, fileName } = await getFileDetails(url, { headers });
    if (!totalBytes) {
        numConnections = 1;
    }
    const maximumBytesPerConnection = Math.floor(totalBytes / numConnections);
    return await Promise.all(
        Array.from(Array(numConnections).keys()).map((i) => {
            const startBytes = i * maximumBytesPerConnection;
            const endBytes = i === numConnections - 1 ? '' : i * maximumBytesPerConnection + maximumBytesPerConnection - 1;
            const bytes = endBytes ? endBytes - startBytes : totalBytes - startBytes;
            const progressBar = debug ? multiBar.create(bytes, 0, { worker: i }) : undefined;
            return httpDownload({
                url,
                startBytes,
                endBytes,
                fileName: `${fileName}-${i}`,
                isRangeHeader: numConnections > 1,
                headers,
                onData: (chunk) => {
                    progressBar?.increment(chunk.length);
                },
                directory,
            });
        })
    ).then(() => {
        return mergeFile(fileName, numConnections, directory);
    });
};

export default download;
