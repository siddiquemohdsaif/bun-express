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
            return new Response("404 Not Found :" + url.pathname, { status: 404 });
        }
    }

    listen(port, callback) {
        Bun.serve({
            fetch: async (req) => {  // Use an arrow function here
                return await this.handleRequest(req);
            }
        });
        if (callback) callback();
    }
}

module.exports = {
    Application,
    createApp: function () {
        return new Application();
    }
};
