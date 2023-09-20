import BunExpress from '../lib/bun-express.js';
const app = BunExpress.createApp();



// Create a router
const router = app.router();

router.get('/test', (req, res) => {
    res.status(200).json({ message: 'Router GET succeed' });
});

// router.post('/test', (req, res) => {
//     res.status(200).json({ message: 'Router POST succeed' });
// });

// router.put('/test', (req, res) => {
//     res.status(200).json({ message: 'Router PUT succeed' });
// });

// Use the router in the app
app.use('/your_route_path', router);

// Start the server
const port = 3100;
app.listen(port, () => console.log(`Server started on port ${port} . Timestamp: ${Date.now()}`));

