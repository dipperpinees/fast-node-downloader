import fs from 'fs';
import http from 'http';
import https from 'https';

type Chunk = {
    length: number;
};

interface IDownloadArgument {
    fileName: string;
    url: string;
    startBytes: number;
    endBytes: number | string;
    directory: string;
    onData: (chunk: Chunk) => void;
}

const httpDownload = ({ url, startBytes, endBytes, fileName, onData, directory }: IDownloadArgument) => {
    const request = url.startsWith('https://') ? https : http;
    const range = startBytes && `bytes=${startBytes}-${endBytes}`;
    return new Promise((resolve, reject) => {
        request.get(url, { headers: range ? { Range: range } : {} }, (res) => {
            const isOK = res.statusCode && res.statusCode >= 200 && res.statusCode < 300;
            if (!isOK) reject('Cannot download partial file');

            const file = fs.createWriteStream(`${directory}${directory.endsWith('/') ? '' : '/'}${fileName}`);
            res.pipe(file);

            file.on('data', onData);

            file.on('finish', () => {
                file.close();
                resolve('Partial file downloaded successfully');
            });
        });
    });
};

export default httpDownload;
