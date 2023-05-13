import isURL from '../../src/lib/isURL';

test('is url', () => {
    expect(isURL('https://getsamplefiles.com/download/mp4/sample-1.mp4')).toBe(true);
});

describe('is not url', () => {
    const urlList = [
        'httpsgetsamplefiles.com/download/mp4/sample-1.mp4',
        'htt://getsamplefiles.com/download/mp4/sample-1.mp4',
        'https://getsamplefilesdownload/mp4/sample-1.mp4',
    ];

    test.each(urlList)('passes for integer value %j', (url) => expect(isURL(url)).toBe(false));
});
