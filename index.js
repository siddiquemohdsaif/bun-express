import Option from './lib/Options.js';
import Option from './lib/Options.js';
import BunExpress from './lib/bun-express.js';

//const app = BunExpress.createApp(new Option(Option.INSTANCE.MAX, Option.ROUTING_TYPE.LEAST_CONNECTION));
const app = BunExpress.createApp(new Option(1 , Option.ROUTING_TYPE.LEAST_CONNECTION));


//Sample middleware
app.use((req) => {
    req.timestamp = Date.now();
});
app.use(BunExpress.json());


// Routes
app.get('/delaySecond', async (req, res) => {
    // Simulate some asynchronous operation
    await new Promise(resolve => setTimeout(resolve, 1000));
    res.send("Hello from the home page!");
});

app.post('/json', async (req, res) => {
    const responseData = {
        message: "Hello from the home page!",
        data: "req.body.data"
    };
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(JSON.stringify(responseData));
});


app.get('/users/:userId', (req, res) => {
    const userId = req.params.userId;
    res.send(`User ID: ${userId}`);
});

app.get('/test/:id/:name', (req, res) => {
    const id = req.params.id;
    const name = req.params.name;
    res.send(`User ID: ${id}  name: ${name}`);
});


app.get('/pathHandle/*', async (req, res) => {
    res.send( " path:"+req.url);
});

app.get('/*', (req, res) => {
    res.status(404).send("my custom : 404 not found : " + req.path);
});


app.get('/', async (req, res) => {
    res.send(`Hello world Hello world Hello ${app.proxyPort}`);
});

// Start the server
const port = 3250;
app.listen(port, () => console.log(`Server started on port ${port}  proxyPort ${app.proxyPort} . Timestamp: ${Date.now()}`));
