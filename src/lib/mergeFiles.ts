import * as fs from 'fs';
import * as multistream from 'multistream';
import { getDownloadDirectory } from './downloadDirectory';

const mergeFile = (fileName: string, length: number, directory: string) => {
    const filesToMerge: string[] = [];
    const destinationFile = `${directory}${directory.endsWith('/') ? '' : '/'}${fileName}`;
    const output = fs.createWriteStream(destinationFile);
    for (let i = 0; i < length; i++) {
        filesToMerge.push(`${destinationFile}-${i}`);
    }

    return new Promise<string>((resolve, reject) => {
        const multiStream = new multistream(filesToMerge.map((file) => fs.createReadStream(file)));
        multiStream.pipe(output);
        multiStream.on('end', () => {
            // Remove temp
            for (const file of filesToMerge) {
                fs.unlinkSync(file);
            }
            resolve(destinationFile);
        });
        multiStream.on('error', () => {
            reject(false);
        });
    });
};

export default mergeFile;
