import path from 'path';

export const getFileNameFromURL = (urlString: string) => {
    const parsedUrl = new URL(urlString);
    const fileName: string = path.basename(parsedUrl.pathname);
    return fileName;
};

export const getFileNameFromHeader = (contentDispositionHeader: string | undefined) => {
    if (!contentDispositionHeader) return;

    const contentDispositionParts = contentDispositionHeader.split(';');
    for (const part of contentDispositionParts) {
        const partContent = part.trim();
        if (partContent.startsWith('filename=')) {
            let fileName: string = partContent.split('=')[1].trim();
            if (fileName.startsWith(`"`)) fileName = fileName.substring(1);
            if (fileName.endsWith(`"`)) fileName = fileName.substring(0, fileName.length - 1);
            return fileName;
        }
    }

    return '';
};
