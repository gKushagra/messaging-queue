require('dotenv').config();
const express = require('express');
const { v4: uuid } = require('uuid');
const PORT = process.env.PORT;

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: false }));

// TODO check if data directory exists, create if not exists

// In-memory queues
var consumers = [];
var queues = [];

// consumers
app.post('/queues/:queue/consumers', function (req, res, next) {
    try {
        var consumer = consumers.find(c =>
            c.clientSecret === req.body.clientSecret && c.queue === req.params.queue);
        consumer = new Consumer(uuid(), req.body.clientSecret, req.params.queue);
        consumers.push(consumer);
        res.status(200).json(consumer.id);
    } catch (error) {
        console.error('An error occurred', error);
        res.sendStatus(500);
    }
});

// queues
app.get('/queues', function (req, res, next) {
    try {
        var queueNames = queues.map(q => q.name);
        console.log(queueNames);
        res.status(200).json(queueNames);
    } catch (error) {
        console.error('An error occurred', error);
        res.sendStatus(500);
    }
});

app.post('/queues/:queue', function (req, res, next) {
    try {
        var queue = new Queue(req.params.queue);
        queues.push(queue);
        res.sendStatus(200);
    } catch (error) {
        console.error('An error occurred', error);
        res.sendStatus(500);
    }
});

app.delete('/queues/:queue', function (req, res, next) {
    try {
        queues = queues.filter(q => q.name === req.params.queue);
        res.sendStatus(200);
    } catch (error) {
        console.error('An error occurred', error);
        res.sendStatus(500);
    }
});

// publish
app.post('/queues/:queue/messages', function (req, res, next) {
    try {
        var queue = queues.find(q => q.name === req.params.queue);
        queue.Enqueue(req.body.message);
        res.sendStatus(200);
    } catch (error) {
        console.error('An error occurred', error);
        res.sendStatus(500);
    }
});

// consume
app.get('/queues/:queue/consumers/:id/messages', function (req, res, next) {
    try {
        var queue = queues.find(q => q.name === req.params.queue);
        if (queue) {
            // check if valid consumer
            var consumer = consumers.find(c => c.id === req.params.id && c.queue === req.params.queue);
            if (consumer) {
                var message = queue.Dequeue();
                if (message != null) {
                    res.status(200).json(message);
                } else {
                    res.sendStatus(204);
                }
            } else {
                res.sendStatus(204);
            }
        } else {
            res.sendStatus(204);
        }
    } catch (error) {
        console.error('An error occurred', error);
        res.sendStatus(500);
    }
});

app.listen(PORT || 5455, function () {
    console.info('Queue server listening on PORT ' + PORT);
});
