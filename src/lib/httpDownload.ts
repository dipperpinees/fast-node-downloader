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
    isRangeHeader: boolean;
    headers: http.OutgoingHttpHeaders;
}

const httpDownload = ({
    url,
    startBytes,
    endBytes,
    fileName,
    onData,
    directory,
    isRangeHeader,
    headers,
}: IDownloadArgument) => {
    const request = url.startsWith('https://') ? https : http;
    const range = `bytes=${startBytes}-${endBytes}`;
    return new Promise((resolve, reject) => {
        request.get(
            url,
            {
                headers: {
                    ...(isRangeHeader && { Range: range }),
                    ...headers,
                },
            },
            (res) => {
                const isOK = res.statusCode && res.statusCode >= 200 && res.statusCode < 300;
                if (!isOK) reject(new Error('Cannot download partial file'));

                const file = fs.createWriteStream(`${directory}${directory.endsWith('/') ? '' : '/'}${fileName}`);
                res.pipe(file);

                file.on('data', onData);

                file.on('finish', () => {
                    file.close();
                    resolve('Partial file downloaded successfully');
                });
            }
        );
    });
};

export default httpDownload;
