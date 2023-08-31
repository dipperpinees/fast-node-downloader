function isURL(url = ''): boolean {
    /* eslint-disable no-useless-escape */
    const urlPattern = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;
    return !!urlPattern.test(url);
}

export default isURL;
