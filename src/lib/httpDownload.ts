import * as fs from 'fs';
import * as http from 'http';
import * as https from 'https';
import * as path from 'path';

interface IDownloadArgument {
    fileName: string;
    url: string;
    startBytes: number;
    endBytes: number | string;
    onData: (chunk: any) => void;
}

const httpDownload = ({ url, startBytes, endBytes, fileName, onData }: IDownloadArgument) => {
    const request = url.startsWith('https://') ? https : http;
    const range = startBytes && `bytes=${startBytes}-${endBytes}`;
    return new Promise((resolve, reject) => {
        request.get(url, { headers: range ? { Range: range } : {} }, (res) => {
            const isOK = res.statusCode && res.statusCode >= 200 && res.statusCode < 300;
            if (!isOK) reject('Cannot download partial file');

            const file = fs.createWriteStream(path.join(__dirname, `../temp/${fileName}`));
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
