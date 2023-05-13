import { getFileNameFromURL } from '../../src/lib/getFileName';

test('get file name from url', () => {
    expect(getFileNameFromURL('https://getsamplefiles.com/download/mp4/sample-1.mp4')).toBe('sample-1.mp4');
});
