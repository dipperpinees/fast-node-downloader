import * as fs from 'fs';
import * as multistream from 'multistream';
import { getDownloadDirectory } from './downloadDirectory';
import * as path from 'path';

const mergeFile = (fileName: string, length: number, directory: string | undefined) => {
    const filesToMerge: string[] = [];
    const directoryPath = directory || getDownloadDirectory();
    const destinationFile = `${directoryPath}${directoryPath.endsWith('/') ? '' : '/'}${fileName}`;
    const output = fs.createWriteStream(destinationFile);
    for (let i = 0; i < length; i++) {
        filesToMerge.push(path.join(__dirname, `../temp/${fileName}-${i}`));
    }
    
    return new Promise((resolve, reject) => {
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
