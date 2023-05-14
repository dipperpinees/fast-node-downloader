import * as https from 'https';
import * as http from 'http';
import { getFileNameFromHeader, getFileNameFromURL } from './getFileName';

interface IFileDetails {
    totalBytes: number;
    fileName: string;
}

const getFileDetails = (url: string, timeout = 10000): Promise<IFileDetails> => {
    const request = url.startsWith('https://') ? https : http;
    return new Promise<IFileDetails>((resolve, reject) => {
        request.get(url, { timeout }, (res) => {
            res.destroy();
            const isOK = res.statusCode && res.statusCode >= 200 && res.statusCode < 300;
            if (!isOK) reject(new Error(`request abort with status ${res.statusCode || ''}`));
            resolve({
                totalBytes: Number(res.headers['content-length']),
                fileName: getFileNameFromHeader(res.headers['content-disposition']) || getFileNameFromURL(url),
            });
        });
    });
};

export default getFileDetails;
