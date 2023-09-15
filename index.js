class Router {
    constructor() {
        this.routes = {
            GET: {},
            POST: {},
            PUT: {},
            DELETE: {}
        };
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
        const method = req.method;
        const url = new URL(req.url);
        const handler = this.routes[method][url.pathname];
        
        let finalResponse;
    
        if (handler) {
            // Mimic express's req and res objects
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
}

const app = new Router();

function startServer(router) {
    Bun.serve({
        async fetch(req) {
            return await router.handleRequest(req);
        }
    });
}

app.get('/', async (req, res) => {
    // Simulate some asynchronous operation
    await new Promise(resolve => setTimeout(resolve, 1000));
    res.send("data");
});

app.get('/ddd', (req, res) => {
    res.send("data");
});


startServer(app);
