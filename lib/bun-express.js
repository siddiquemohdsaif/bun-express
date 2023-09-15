// bun-express.js

class Application {
    constructor() {
        this.routes = {
            GET: {},
            POST: {},
            PUT: {},
            DELETE: {}
        };
        this.middlewares = [];
    }

    use(path, handler) {
        if (typeof path === 'function') {
            // It's a middleware
            this.middlewares.push(path);
        } else {
            // Convert path to regex and store it as a route
            const method = handler.method || 'GET';
            const regexPath = this._convertRouteToRegex(path);
            this.routes[method][regexPath.pattern] = { ...regexPath, handler }; // Store with handler
        }
    }

    _convertRouteToRegex(path) {
        const paramNames = [];
        const regexPath = path.replace(/\/:([\w]+)/g, function(_, paramName) {
            paramNames.push(paramName);
            return '/(?<' + paramName + '>\\w+)';
        }).replace(/\/\*/, '\/.*');
        return {
            pattern: new RegExp('^' + regexPath + '$'),
            paramNames: paramNames
        };
    }

    get(path, handler) {
        const regexPath = this._convertRouteToRegex(path);
        this.routes.GET[regexPath.pattern] = { ...regexPath, handler };
    }
    
    post(path, handler) {
        const regexPath = this._convertRouteToRegex(path);
        this.routes.POST[regexPath.pattern] = { ...regexPath, handler };
    }
    
    put(path, handler) {
        const regexPath = this._convertRouteToRegex(path);
        this.routes.PUT[regexPath.pattern] = { ...regexPath, handler };
    }
    
    delete(path, handler) {
        const regexPath = this._convertRouteToRegex(path);
        this.routes.DELETE[regexPath.pattern] = { ...regexPath, handler };
    }
    

    async handleRequest(req) {

        // Run middlewares
        for (const middleware of this.middlewares) {
            await middleware(req);
        }

        let finalResponse;

        const method = req.method;
        const url = new URL(req.url);

        let matchedRoute;
        let match;

        for (const route in this.routes[method]) {
            const routeInfo = this.routes[method][route];
            const { pattern, paramNames } = routeInfo;
            match = pattern.exec(url.pathname);
            if (match) {
                matchedRoute = routeInfo.handler; // Here, get the handler from routeInfo
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

    static json() {
        return async (req) => {
            if (req.body != null && req.headers.get("Content-Type") === "application/json") {
                req.BODY = await req.json();
            }
        };
    }

    listen(port, callback) {
        Bun.serve({
            port,
            fetch: async (req) => {
                return await this.handleRequest(req);
            }
        });
        if (callback) callback();
    }
}

const createApp = () => new Application();

const BunExpress = {
    Application,
    createApp,
    json: Application.json
};

export default BunExpress;
