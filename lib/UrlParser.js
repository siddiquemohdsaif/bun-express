class UrlParser {
    static supportedProtocols = {
        'http:': true,
        'https:': true,
        'ws:': true,
        'wss:': true,
        'ftp:': true,
        'ftps:': true,
        'sftp:': true,
        'file:': true,
    };

    constructor(inputUrl) {
        this.url = inputUrl;
        this.#parse(inputUrl);
    }

    #parse(inputUrl) {
        const protocolEndIndex = inputUrl.indexOf("://");
        if (protocolEndIndex === -1) {
            throw new Error(`Invalid URL: ${inputUrl}`);
        }

        const protocol = inputUrl.slice(0, protocolEndIndex + 1);

        if (!UrlParser.supportedProtocols[protocol]) {
            throw new Error(`Unsupported protocol: ${protocol}`);
        }

        const restOfUrl = inputUrl.slice(protocolEndIndex + 3);
        const pathStartIndex = restOfUrl.indexOf("/");
        const domain = pathStartIndex !== -1 ? restOfUrl.slice(0, pathStartIndex) : restOfUrl;

        const pathAndQuery = pathStartIndex !== -1 ? restOfUrl.slice(pathStartIndex) : "";
        const queryStartIndex = pathAndQuery.indexOf("?");
        const path = queryStartIndex !== -1 ? pathAndQuery.slice(0, queryStartIndex) : pathAndQuery;

        const query = {};
        const queryString = queryStartIndex !== -1 ? pathAndQuery.slice(queryStartIndex + 1) : "";
        const pairs = queryString.split('&');
        for (const pair of pairs) {
            const [key, value] = pair.split('=');
            query[decodeURIComponent(key)] = decodeURIComponent(value || '');
        }

        // Assigning parsed values to instance variables
        this.protocol = protocol.slice(0, -1);
        this.domain = domain;
        this.path = path;
        this.query = query;
    }
}

export default UrlParser;
