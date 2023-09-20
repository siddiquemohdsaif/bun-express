
let port  = 3100;
Bun.serve({
    port,
    fetch(req) {
      return new Response("Bun!");
    },
});