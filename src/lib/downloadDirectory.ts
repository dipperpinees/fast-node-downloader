import * as fs from 'fs';
import { DEFAULT_DOWNLOAD_DIR, DIRECTORY_TEMP_PATH } from './constants';

const getDownloadDirectory = () => {
    if (fs.existsSync(DIRECTORY_TEMP_PATH)) {
        const directoryTempContent = fs.readFileSync(DIRECTORY_TEMP_PATH, { encoding: 'utf8' });
        if (fs.existsSync(directoryTempContent)) return directoryTempContent;
    }

    if (!fs.existsSync(DEFAULT_DOWNLOAD_DIR)) {
        fs.mkdirSync(DEFAULT_DOWNLOAD_DIR)
    }

    return DEFAULT_DOWNLOAD_DIR;
};

const saveDownloadDirectoryTemp = (path: string) => {
    return fs.writeFileSync(DIRECTORY_TEMP_PATH, path);
};

export { getDownloadDirectory, saveDownloadDirectoryTemp };
