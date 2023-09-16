import ExpressRequest from "./ExpressRequest";
import ExpressResponse from "./ExpressResponse";
import UrlParser from "./UrlParser";

class Application {
    constructor() {
        this.routes_DIRECT = {
            GET: {},
            POST: {},
            PUT: {},
            DELETE: {}
        };
        this.routes_REGEX = {
            GET: {},
            POST: {},
            PUT: {},
            DELETE: {}
        };
        this.middlewares = [];
        this.usedMiddleware = false;
    }

    _addMiddleware(middleware) {
        this.middlewares.push(middleware);
        this.usedMiddleware = true;
    }

    _addRoute(method, path, handler) {
        if (path.includes(':') || path.includes('*')) {
            const regexPath = this._convertRouteToRegex(path);
            this.routes_REGEX[method][regexPath.pattern] = { ...regexPath, handler };
        } else {
            this.routes_DIRECT[method][path] = handler;
        }
    }

    use(path, handler) {
        if (typeof path === 'function') {
            this._addMiddleware(path);
        } else {
            this._addRoute(handler.method || 'GET', path, handler);
        }
    }

    _convertRouteToRegex(path) {
        const paramNames = [];
        const regexPath = path.replace(/\/:([\w]+)/g, (_, paramName) => {
            paramNames.push(paramName);
            return `/(?<${paramName}>\\w+)`;
        }).replace(/\/\*/, '/.*');

        return {
            pattern: new RegExp('^' + regexPath + '$'),
            paramNames
        };
    }


    /**
     * Registers a handler for the GET HTTP method.
     * 
     * @param {string} path - The URL path to listen for.
     * @param {function(ExpressRequest, ExpressResponse): Promise} handler - The callback function to handle the request and send a response.
     */
    get(path, handler) {
        this._addRoute('GET', path, handler);
    }

    /**
     * Registers a handler for the POST HTTP method.
     * 
     * @param {string} path - The URL path to listen for.
     * @param {function(ExpressRequest, ExpressResponse): Promise} handler - The callback function to handle the request and send a response.
     */
    post(path, handler) {
        this._addRoute('POST', path, handler);
    }

    /**
     * Registers a handler for the PUT HTTP method.
     * 
     * @param {string} path - The URL path to listen for.
     * @param {function(ExpressRequest, ExpressResponse): Promise} handler - The callback function to handle the request and send a response.
     */
    put(path, handler) {
        this._addRoute('PUT', path, handler);
    }

    /**
     * Registers a handler for the DELETE HTTP method.
     * 
     * @param {string} path - The URL path to listen for.
     * @param {function(ExpressRequest, ExpressResponse): Promise} handler - The callback function to handle the request and send a response.
     */
    delete(path, handler) {
        this._addRoute('DELETE', path, handler);
    }


    /**
     *  handle incomming Request from Bun.
     * @param {Request} req - Bun Request.
    */
    async handleRequest(req) {

        const method = req.method;
        const url = new UrlParser(req.url);

        // First, try to find a direct match
        let matchedRoute;
        let match;
        const directMatchedRoute = this.routes_DIRECT[method][url.path];
        if (directMatchedRoute) {
            matchedRoute = directMatchedRoute;

        } else {
            // If no direct match, then try the regex routes
            for (const route in this.routes_REGEX[method]) {
                const routeInfo = this.routes_REGEX[method][route];
                const { pattern, paramNames } = routeInfo;
                match = pattern.exec(url.path);
                if (match) {
                    matchedRoute = routeInfo.handler;
                    req.params = {};
                    paramNames.forEach((name) => {
                        req.params[name] = match.groups[name];
                    });
                    break;
                }
            }
        }



        const request = new ExpressRequest(method, req, url.path, url.protocol, url.domain, req.headers, req.params, url.query, req.body);
        const response = new ExpressResponse();


        // Run middlewares
        if (this.usedMiddleware) {
            for (const middleware of this.middlewares) {
                await middleware(request);
            }
        }

        if (matchedRoute) {
            await matchedRoute(request, response);
            return response.getResponse();
        } else {
            return new Response("404 Not Found, path :" + url.path, { status: 404 });
        }
    }


    _matchRegexRoute(method, path) {
        for (const route in this.routes_REGEX[method]) {
            const { pattern, paramNames, handler } = this.routes_REGEX[method][route];
            const match = pattern.exec(path);
            if (match) {
                const params = paramNames.reduce((acc, name) => {
                    acc[name] = match.groups[name];
                    return acc;
                }, {});
                return { handler, params };
            }
        }
        return null;
    }

    static json() {
        /**
        *  JSON parser
        * @param {ExpressRequest} req - HTTP method.
        */
        return async (req) => {
            if (req.request.headers.get("Content-Type") === "application/json") {
                try{
                    req.body = await req.request.json();
                }catch(e){
                    // ignore
                }
            }
        };
    }

    listen(port, callback) {
        Bun.serve({
            port,
            fetch: this.handleRequest.bind(this)
        });
        if (callback) callback();
    }
}

const BunExpress = {
    createApp: () => new Application(),
    Application,
    json: Application.json
};

export default BunExpress;
