import isURL from '../../src/lib/isURL';

test('is valid url', () => {
    expect(isURL('https://www.example.com')).toBe(true);
    expect(isURL('https://example.com')).toBe(true);
    expect(isURL('http://www.example.com')).toBe(true);
    expect(isURL('http://example.com:3000')).toBe(true);
    expect(isURL('http://www.example.com:3000')).toBe(true);
    expect(isURL('http://example.com/path/to/page')).toBe(true);
    expect(
        isURL(
            `https://rr2---sn-25ge7nzz.googlevideo.com/videoplayback?expire=1693494562&ei=wljwZJerGKyTxN8P44ieyAs&ip=86.244.194.117&id=o-AOH9POdaDvQFjbU-uDZoe1jnSWKnp5EgCVtlMIpCEdM1&itag=394&aitags=133%2C134%2C135%2C136%2C160%2C242%2C243%2C244%2C247%2C278%2C298%2C299%2C302%2C303%2C308%2C315%2C394%2C395%2C396%2C397%2C398%2C399%2C400%2C401&source=youtube&requiressl=yes&mh=aP&mm=31%2C26&mn=sn-25ge7nzz%2Csn-4g5edn6r&ms=au%2Conr&mv=m&mvi=2&pl=16&initcwndbps=1575000&spc=UWF9f-EKzpsSXd2yVSLgm-k4Iix15c0Zz3JbdPCnig&vprv=1&svpuc=1&mime=video%2Fmp4&ns=IZnBqNlqnEZ1aDCtAqLwngkP&gir=yes&clen=5156331&dur=634.566&lmt=1662343634767677&mt=1693472466&fvip=5&keepalive=yes&fexp=24007246%2C24363393&beids=24350018&c=WEB&txp=5532434&n=5apuw0KvjpG-ig&sparams=expire%2Cei%2Cip%2Cid%2Caitags%2Csource%2Crequiressl%2Cspc%2Cvprv%2Csvpuc%2Cmime%2Cns%2Cgir%2Cclen%2Cdur%2Clmt&sig=AOq0QJ8wRgIhAI54KvDqm_ltj7tK7Dd8uHIHE-cYqq1qkQUDLEb_v-u5AiEA6g45sAwttq5OjIdP8LH_wKxKeL3bAdX3G6Bt04oEfUU%3D&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=AG3C_xAwRQIgLVI3Atgf8iM4p-2FvAzEs0iF3ny-nfd0q1_n0yTtZEsCIQDhXBbigIJFrQHs14svOkH437NtoKvlPZKsBSowz2stJQ%3D%3D`
        )
    ).toBe(true);
});

test('is invalid url', () => {
    expect(isURL('www.example.com')).toBe(false);
    expect(isURL('example.com')).toBe(false);
    expect(isURL('')).toBe(false);
    expect(isURL(undefined)).toBe(false);
    expect(isURL('not a url')).toBe(false);
    expect(isURL('12345')).toBe(false);
});