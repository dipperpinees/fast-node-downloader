import fs from 'fs';
import os from 'os';

const HOME_DIR = os.homedir();
const DEFAULT_DOWNLOAD_DIR = `${HOME_DIR}/Downloads`;

const getDownloadDirectory = () => {
    if (!fs.existsSync(DEFAULT_DOWNLOAD_DIR)) {
        fs.mkdirSync(DEFAULT_DOWNLOAD_DIR);
    }

    return DEFAULT_DOWNLOAD_DIR;
};

export default getDownloadDirectory;
