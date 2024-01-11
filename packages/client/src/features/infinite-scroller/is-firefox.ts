const testUserAgent = (regexp: RegExp) => regexp.test(navigator.userAgent);

export const isFirefox = testUserAgent(/Firefox/u);
