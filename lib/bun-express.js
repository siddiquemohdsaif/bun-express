import ExpressRequest from "./ExpressRequest";
import ExpressResponse from "./ExpressResponse";
import UrlParser from "./UrlParser";
import Option from "./Options";
import NginxLoadBalancer from "./load-balancer/NginxLoadBalancer";
import Router from "./Router";

class Application {

     /**
     * constructor
     * @param {Option} option - Configuration options for the application.
     */
    constructor(option) {
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
        this.option = option;
        this.isMaster = !process.env.CLUSTER_BUN_WORKER;
        if(!this.isMaster){
            this.proxyPort = process.env.CLUSTER_BUN_WORKER_PROXY_PORT;
        }
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
        } else if (handler instanceof Router) {
            const router = handler;
            for (const method of ['GET', 'POST', 'PUT', 'DELETE']) {
                for (const routePath in router.routes_DIRECT[method]) {
                    const fullPath = path + routePath;
                    this._addRoute(method, fullPath, router.routes_DIRECT[method][routePath]);
                }

                for (const regexPattern in router.routes_REGEX[method]) {
                    const fullPath = path + regexPattern;
                    this._addRoute(method, fullPath, router.routes_REGEX[method][regexPattern].handler);
                }
            }
        } else {
            this._addRoute(handler.method || 'GET', path, handler);
        }
    }

    router() {
        return new Router();
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

        return new Response("Bunn!");

        // const method = req.method;
        // const url = new UrlParser(req.url);

        // // First, try to find a direct match
        // let matchedRoute;
        // const directMatchedRoute = this.routes_DIRECT[method][url.path];
        // if (directMatchedRoute) {
        //     matchedRoute = directMatchedRoute;

        // } else {
        //     // If no direct match, then try the regex routes
        //     matchedRoute = this._matchRegexRoute(req, method, url);
        // }



        // const request = new ExpressRequest(method, req, url.path, url.protocol, url.domain, req.headers, req.params, url.query, req.body);
        // const response = new ExpressResponse();


        // // Run middlewares
        // if (this.usedMiddleware) {
        //     for (const middleware of this.middlewares) {
        //         await middleware(request);
        //     }
        // }

        // if (matchedRoute) {
        //     await matchedRoute(request, response);
        //     return response.getResponse();
        // } else {
        //     return new Response("404 Not Found, path :" + url.path, { status: 404 });
        // }
    }


    _matchRegexRoute(req, method, url) {
        let matchedRoute;
        let match;
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
        return matchedRoute;
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

    /**
     * Start the server
     * @param {number} port - The URL path to listen for.
     * @param {function(): Promise} callback - The callback function call when server created.
     */
    async listen(port, callback) {


        if(this.option){
            if(this.isMaster){

                const loadbalancer = new NginxLoadBalancer(port, this.option)
                port = await loadbalancer.start();
                this.proxyPort = port

            }else{
                port = this.proxyPort;
            }
        }else{
            await NginxLoadBalancer.CLEAR_PORT(port);
        }


        Bun.serve({
            port,
            fetch: this.handleRequest.bind(this)
            // fetch(req) {
            //     return new Response("Bun!");
            // },
        });
        if (callback) callback();
    }
}


const BunExpress = {
    
    /**
     * Creates a new Application instance.
     * @param {Option} option - Configuration options for the application.
     * @returns {Application} A new Application instance.
     */
    createApp: (option) => new Application(option),

    /** 
     * Reference to the Application class.
     */
    Application,

    /**
     * JSON parser utility function.
     * @function
     * @returns {function} Middleware function for JSON parsing.
     */
    json: Application.json
};

export default BunExpress;
