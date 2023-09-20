// Router.js
class Router {
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
    }

    _addRoute(method, path, handler) {
        if (path.includes(':') || path.includes('*')) {
            const regexPath = Application.prototype._convertRouteToRegex(path);
            this.routes_REGEX[method][regexPath.pattern] = { ...regexPath, handler };
        } else {
            this.routes_DIRECT[method][path] = handler;
        }
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

    match(method, path) {
        let matchedRoute = this.routes_DIRECT[method][path];
        if (matchedRoute) {
            return matchedRoute;
        } else {
            for (const route in this.routes_REGEX[method]) {
                const routeInfo = this.routes_REGEX[method][route];
                const match = routeInfo.pattern.exec(path);
                if (match) {
                    return { ...routeInfo, params: match.groups };
                }
            }
        }
        return null;
    }
}

export default Router;
