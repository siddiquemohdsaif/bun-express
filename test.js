import URL_PARSER from './lib/UrlParser'; // assuming your parser is in a file named URL_PARSER.js

const jsonObj = { data : "name sddddf" , nest : { val: 23 } }

const stringParam = encodeURIComponent(JSON.stringify(jsonObj));

const testURLs = [
    'http://localhost:3000/dddddss',
    'http://example.com',
    'https://example.com/path/to/resource',
    'ws://chat.example.com/messages',
    'wss://securechat.example.com/messages',
    'ftp://ftp.example.com/files',
    'ftps://secureftp.example.com/files',
    'sftp://sftp.example.com/files',
    'file:///home/user/documents/file.txt',
    'http://example.com/path?query=value',
    'https://example.com/path?query1=value1&query2=value2',
    'ws://chat.example.com/messages?user=john',
    'wss://securechat.example.com/messages?room=123&token=abc',
    'ftp://ftp.example.com/files?file=file1.txt',
    'ftps://secureftp.example.com/files?download=true',
    'sftp://sftp.example.com/files?location=remote',
    'file:///home/user/documents/file.txt?version=2',
    'http://example.com:8080/path/to/resource',
    'https://www.google.com/search?q=extend&rlz=1C1RXQR_enIN1063IN1063&oq=extand&gs_lcrp=EgZjaHJvbWUqDAgCEAAYChixAxiABDIGCAAQRRg5MgwIARAAGAoYsQMYgAQyDAgCEAAYChixAxiABDIPCAMQABgKGIMBGLEDGIAEMhIIBBAuGAoYxwEYsQMY0QMYgAQyCQgFEAAYChiABDIMCAYQABgKGLEDGIAEMgwIBxAAGAoYsQMYgAQyDAgIEAAYChixAxiABDIPCAkQABgKGIMBGLEDGIAE0gEMMTAwOTI4OGowajE1qAIAsAIA&sourceid=chrome&ie=UTF-8',
    'https://user:password@example.com/path/to/resource?auth=true',
    `https://example.com/path/to/resource?jsonObj=${stringParam}`
];

console.log("Testing URL_PARSER...");
for (const url of testURLs) {
    console.log(`\nInput URL: ${url}`);
    try {
        const result = new URL_PARSER(url);
        console.log('Parsed Result:', result);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

const url = new URL(`https://example.com/path/to/resource?jsonObj=${stringParam}`);

// Get all query parameters using the searchParams property
for (let [key, value] of url.searchParams.entries()) {
    console.log(`Key: ${key}, Value: ${value}`);
}


// If you specifically want to log the 'jsonObj' query parameter
const jsonObjParam = url.searchParams.get('jsonObj');
if (jsonObjParam) {
    const q = {query : jsonObjParam}
    console.log('jsonObj:', q);
}