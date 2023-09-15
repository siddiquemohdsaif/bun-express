# bunserverv2

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.js
```

This project was created using `bun init` in bun v1.0.1. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.



## Bun Toolkit

Bun is an integrated toolkit for JavaScript and TypeScript applications offering:
- A faster JavaScript runtime alternative to Node.js.
- Direct execution of .jsx, .ts, and .tsx files.
- Support for both ESM and CommonJS modules.
- Inclusion of web-standard APIs and aims for full Node.js compatibility.

```bash
bun run index.tsx
bun run start
bun install <pkg>
bun build ./index.tsx
bun test
bunx cowsay "Hello, world!"
```

## HTTP Server in Bun

Bun provides its own API, Bun.serve, for initiating high-performance HTTP servers.

```javascript
Bun.serve({
  fetch(req) {
    return new Response("Bun!");
  },
});
```

Configuration options are available, including listening ports, hostnames, and error handling.

```javascript
Bun.serve({
  port: 8080,
  hostname: "mydomain.com",
  fetch(req) {
    return new Response("404!");
  },
});
```

Bun supports the native Node.js http and https modules, as well as popular frameworks like Express. Bun.serve is built on web standards:

```javascript
import {serve} from 'bun';

serve({
  async fetch(request) {
    const body = await request.json();
    const {headers} = request;
    const accept = headers.get("Accept");
    if (accept !== "application/json") {
      return new Response(
        "Expected Accept: application/json header",
        {status: 400}
      );
    }
    return Response.json(body);
  }
});
```

## Other Features

- **TLS Support**: Enables secure connections.
```javascript
Bun.serve({
    fetch(req) {
      return new Response("Hello!!!");
    },
    tls: {
      key: Bun.file("./key.pem"),
      cert: Bun.file("./cert.pem"),
    }
});
```

- **WebSockets**: Upgrades HTTP to WebSocket connections.
```javascript
serve({
    fetch(req, server) {
      return server.upgrade(req);
    },
    websocket: {
      message(ws, message) {
        ws.send(message);
      },
    },
});
```

- **HTTPS**: Secure server configurations.
```javascript
serve({
    keyFile: process.env.SSL_KEY_FILE || "./key.pem",
    certFile: process.env.SSL_CERTIFICATE_FILE || "./cert.pem",
    fetch(req) {
      return new Response("Hello HTTPS!");
    },
});
```

- **File Streaming**: Efficient file streaming.
```javascript
Bun.serve({
    fetch(req) {
      return new Response(Bun.file("./hello.txt"));
    },
});
```

### Code Snippets

```javascript
import {serve} from 'bun';
serve({
  fetch(req) {
    return new Response('Hello world!');
  }
});
serve({
  fetch(req) {
    return Response.json({hello: "World"});
  }
});
serve({
  fetch(req) {
    return new Response(file("index.html"));
  }
});
serve({
  fetch(req) {
    return Response.redirect("/redirected");
  }
});
```
