import getFileDetails from '../../src/lib/getFileDetails';

test('get file name from url', async () => {
    const { totalBytes } = await getFileDetails('https://getsamplefiles.com/download/mp4/sample-1.mp4');
    expect(totalBytes).toBe(102795794);
});
