import https from 'https';
import http, { type OutgoingHttpHeaders } from 'http';
import { getFileNameFromHeader, getFileNameFromURL } from './getFileName';

interface IFileDetailsExtraProps {
    timeout?: number;
    headers?: OutgoingHttpHeaders;
}

interface IFileDetails {
    totalBytes: number;
    fileName: string;
}

const getFileDetails = (url: string, { timeout = 10000, headers = {} }: IFileDetailsExtraProps = {}): Promise<IFileDetails> => {
    const request = url.startsWith('https://') ? https : http;
    return new Promise<IFileDetails>((resolve, reject) => {
        request.get(url, { timeout, headers }, (res) => {
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
