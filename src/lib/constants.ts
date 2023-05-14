import os from 'os';

const HOME_DIR = os.homedir();
const DIRECTORY_TEMP_PATH = `${HOME_DIR}/directory.temp`;
const DEFAULT_DOWNLOAD_DIR = `${HOME_DIR}/Downloads`;

export { HOME_DIR, DIRECTORY_TEMP_PATH, DEFAULT_DOWNLOAD_DIR };
