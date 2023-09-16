import BunExpress from './lib/bun-express.js';

const app = BunExpress.createApp();

// Sample middleware
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
    res.send("my custom : 404 not found : " + req.pathname);
});

// Start the server
const port = 3000;
app.listen(port, () => console.log(`Server started on port ${port}. Timestamp: ${Date.now()}`));
