class ExpressRequest {
    /**
     * Constructor for ExpressRequest.
     * 
     * @param {string} method - HTTP method.
     * @param {Request} request - The Request object.
     * @param {string} path - Requested path.
     * @param {string} protocol - The protocol used (e.g., http or https).
     * @param {string} domain - The domain of the request.
     * @param {Object} [header={}] - Request headers.
     * @param {Object} [params={}] - Path parameters.
     * @param {Object} [query={}] - Query string parameters.
     * @param {Object} [body={}] - Request body.
     */
    constructor(method, request, path, protocol, domain, header = {}, params = {}, query = {}, body = {}) {
        this.method = method;
        this.request = request;
        this.path = path;
        this.protocol = protocol;
        this.domain = domain;
        this.header = header;
        this.params = params;
        this.query = query;
        this.body = body;
    }
}

export default ExpressRequest;
