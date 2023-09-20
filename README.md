
# BunExpress

## Installation

BunExpress is currently not available as an npm package. To use it:

1. Download the `lib` folder.
2. Add it to your project directory.

## Usage

Here's a basic example:

```javascript
import BunExpress from './lib/bun-express.js';
const app = BunExpress.createApp();


app.get('/', async (req, res) => {
    res.send("Hello world!");
});

const port = 3000;
app.listen(port, () => console.log(`Server started on port ${port}.`));
```

### 2. Routes

With BunExpress, you can define routes using different patterns:

#### i) Normal Routes

Define a route with a fixed path.

```javascript
app.get('/home', (req, res) => {
    res.send("Hello from the home page!");
});
```

#### ii) Wildcard Routes (*)

A route that can match any path after a specified prefix.

```javascript
app.get('/pathHandle/*', (req, res) => {
    res.send("Path: " + req.url);
});
```

#### iii) Parameterized Routes (:)

Define dynamic parts of a route with `:paramName`.

```javascript
app.get('/users/:userId', (req, res) => {
    const userId = req.params.userId;
    res.send(`User ID: ${userId}`);
});
```

You can also have multiple parameters in one route:

```javascript
app.get('/test/:id/:name', (req, res) => {
    const id = req.params.id;
    const name = req.params.name;
    res.send(`User ID: ${id}  Name: ${name}`);
});
```

### 3. Configuration Options

BunExpress provides an `Option` class to configure how your application behaves, especially in clustered environments.

#### i) Instances

To make your application resilient and scalable, you can run multiple instances of it. BunExpress uses Nginx as a load balancer for these instances.

- **Auto**: Starts a single instance. However, if traffic increases, more instances can be spawned.

```javascript
new Option(Option.INSTANCE.AUTO, Option.ROUTING_TYPE.LEAST_CONNECTION);
```

- **Max**: Starts as many instances as there are CPU cores on the machine.

```javascript
new Option(Option.INSTANCE.MAX, Option.ROUTING_TYPE.LEAST_CONNECTION);
```

- **Specific Number**: Starts a specified number of instances. The number should be between 1 and 100.

```javascript
new Option(3, Option.ROUTING_TYPE.LEAST_CONNECTION);
```

#### ii) Load Balancing with Nginx

When running multiple instances of your application, you need a way to distribute incoming requests among them. BunExpress uses Nginx for this purpose and supports different load-balancing strategies:

- **Round Robin**: Default method where each instance gets a request in a cyclic manner.

```javascript
new Option(Option.INSTANCE.MAX, Option.ROUTING_TYPE.ROUND_ROBIN);
```

- **Least Connection**: Requests are sent to the instance with the fewest active connections.

```javascript
new Option(Option.INSTANCE.MAX, Option.ROUTING_TYPE.LEAST_CONNECTION);
```

- **IP Hash**: Determines which instance handles a request based on the client's IP address.

```javascript
new Option(Option.INSTANCE.MAX, Option.ROUTING_TYPE.IP_HASH);
```

#### iii) Important Notes for Using Nginx

- **Installation**: Ensure Nginx is installed on your machine.
- **Privileged Access**: To use the Nginx functionality with BunExpress, you'll need to start your application with privileged access. For example:

```bash
sudo bun index.js
```

Ensure you have the necessary permissions and take necessary precautions when running commands with sudo.
