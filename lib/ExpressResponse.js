class ExpressResponse {
    constructor() {
        /** @type {Response|null} */
        this.response = null;
        
        /** @type {Object} */
        this.options = {};
    }

    /**
     * Set the status code of the response.
     * @param {number} code - HTTP status code.
     * @returns {ExpressResponse} - Returns the instance for chaining.
     */
    status(code) {
        this.options.status = code;
        return this;
    }

    /**
     * Set custom options for the response.
     * @param {Object} option - Additional options.
     * @returns {ExpressResponse} - Returns the instance for chaining.
     */
    option(option) {
        this.options = Object.assign(this.options, option);
        return this;
    }

    /**
     * Set the status text of the response.
     * @param {string} text - HTTP status text.
     * @returns {ExpressResponse} - Returns the instance for chaining.
     */
    statusText(text) {
        this.options.statusText = text;
        return this;
    }

    /**
     * Send a JSON response.
     * @param {any} body - The JSON body to send.
     */
    json(body) {
        this.response = Response.json(body, this.options);
    }

    /**
     * Send a generic response.
     * @param {any} body - The response body to send.
     */
    send(body) {
        this.response = new Response(body, this.options);
    }

    /**
     * Set a header for the response.
     * @param {string} key - Header name.
     * @param {any} value - Header value.
     * @returns {ExpressResponse} - Returns the instance for chaining.
     * @throws {Error} - Throws an error if key or value is empty.
     */
    setHeader(key, value) {
        if (!key || !value) {
            throw new Error("Headers 'key' or 'value' if not define");
        }

        const headers = this.options.headers;
        if (!headers) {
            this.options.headers = { [key]: value };
        }else{
            this.options.headers[key] = value;
        }
        return this;
    }

    /**
     * Get the headers set for the response.
     * @returns {Object} - Returns the headers object.
     */
    getHeader() {
        return this.options.headers;
    }

    /**
     * Set headers for the response.
     * @param {Object} header - The headers to set.
     * @returns {ExpressResponse} - Returns the instance for chaining.
     */
    headers(header) {
        this.options.headers = header;
        return this;
    }

    /**
     * Get the constructed response.
     * @returns {Response|null} - Returns the response object.
     */
    getResponse() {
        return this.response;
    }

    /**
     * Check if the response is ready.
     * @returns {boolean} - Returns true if the response is ready, false otherwise.
     */
    isReady() {
        return !!this.response;
    }
}

export default ExpressResponse;
