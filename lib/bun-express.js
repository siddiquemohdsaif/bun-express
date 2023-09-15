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
            // It's a route
            const method = handler.method || 'GET';
            this.routes[method][path] = handler;
        }
    }

    get(path, handler) {
        this.routes.GET[path] = handler;
    }

    post(path, handler) {
        this.routes.POST[path] = handler;
    }

    put(path, handler) {
        this.routes.PUT[path] = handler;
    }

    delete(path, handler) {
        this.routes.DELETE[path] = handler;
    }

    async handleRequest(req) {

        // Run middlewares
        for (const middleware of this.middlewares) {
            await middleware(req);
        }


        const method = req.method;
        const url = new URL(req.url);
        const handler = this.routes[method][url.pathname];
        
        let finalResponse;
    
        if (handler) {
            const response = {
                send: (content) => {
                    finalResponse = new Response(content);
                    return finalResponse;
                }
            };
            await handler(req, response);
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
            fetch: async (req) => {  // Use an arrow function here
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
