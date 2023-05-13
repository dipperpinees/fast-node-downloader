import * as fs from 'fs';
import * as path from 'path';

const DIRECTORY_TEMP_PATH = path.join(__dirname, '../directory.temp');

const getDownloadDirectory = () => {
    if (fs.existsSync(DIRECTORY_TEMP_PATH)) {
        const directoryTempContent = fs.readFileSync(DIRECTORY_TEMP_PATH, { encoding: 'utf8' });
        if (fs.existsSync(directoryTempContent)) return directoryTempContent;
    }

    return path.join(__dirname, '../download');
};

const saveDownloadDirectoryTemp = (path: string) => {
    return fs.writeFileSync(DIRECTORY_TEMP_PATH, path);
};

export { getDownloadDirectory, saveDownloadDirectoryTemp };
