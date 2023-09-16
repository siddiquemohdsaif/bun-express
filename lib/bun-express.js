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
    }

    _addMiddleware(middleware) {
        this.middlewares.push(middleware);
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

    get(path, handler) {
        this._addRoute('GET', path, handler);
    }

    post(path, handler) {
        this._addRoute('POST', path, handler);
    }

    put(path, handler) {
        this._addRoute('PUT', path, handler);
    }

    delete(path, handler) {
        this._addRoute('DELETE', path, handler);
    }

    async handleRequest(req) {
        // Run middlewares
        for (const middleware of this.middlewares) {
            await middleware(req);
        }

        let finalResponse;

        const method = req.method;
        const url = new URL(req.url);

        // First, try to find a direct match
        const directMatchedRoute = this.routes_DIRECT[method][url.pathname];
        if (directMatchedRoute) {
            const response = {
                send: (content) => {
                    finalResponse = new Response(content);
                    return finalResponse;
                }
            };
            await directMatchedRoute(req, response);
            return finalResponse;
        }

        // If no direct match, then try the regex routes
        let matchedRoute;
        let match;
        for (const route in this.routes_REGEX[method]) {
            const routeInfo = this.routes_REGEX[method][route];
            const { pattern, paramNames } = routeInfo;
            match = pattern.exec(url.pathname);
            if (match) {
                matchedRoute = routeInfo.handler;
                req.params = {};
                paramNames.forEach((name) => {
                    req.params[name] = match.groups[name];
                });
                break;
            }
        }

        if (matchedRoute) {
            const response = {
                send: (content) => {
                    finalResponse = new Response(content);
                    return finalResponse;
                }
            };
            await matchedRoute(req, response);
            return finalResponse;
        } else {
            return new Response("404 Not Found, path :" + url.pathname, { status: 404 });
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
        return async (req) => {
            if (req.body && req.headers.get("Content-Type") === "application/json") {
                req.BODY = await req.json();
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
