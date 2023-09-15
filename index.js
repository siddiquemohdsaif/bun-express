import BunExpress from './lib/bun-express.js';

const app = BunExpress.createApp();

// Sample middleware
app.use((req) => {
    req.timestamp = Date.now();
});
app.use(BunExpress.json());

// Routes
app.get('/', async (req, res) => {
    // Simulate some asynchronous operation
    await new Promise(resolve => setTimeout(resolve, 1000));
    res.send("Hello from the home page!");
});

app.get('/ddd', (req, res) => {
    res.send("Hello from /ddd!" + req.timestamp);
});

app.post('/jsonBody', async (req, res) => {
    res.send("body.data :" + req.BODY.data);
});

// Start the server
const port = 3100;
app.listen(port, () => console.log(`Server started on port ${port}. Timestamp: ${Date.now()}`));
