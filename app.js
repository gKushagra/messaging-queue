require('dotenv').config();
const express = require('express');
const { v4: uuid } = require('uuid');
const Consumer = require('./Consumer');
const MessageQueue = require('./MessageQueue');
const PORT = process.env.PORT;

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: false }));

// TODO check if data directory exists, create if not exists

// In-memory objects
var consumers = []; // current consumers
var queues = [];    // use this to dump data

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
        var queue = new MessageQueue(req.params.queue);
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

// register consumer
app.post('/queues/:queue/consumers', function (req, res, next) {
    try {
        var consumer = consumers.find(c =>
            c.clientSecret === req.body.clientSecret && c.queue === req.params.queue);
        if (!consumer) {
            consumer = new Consumer(uuid(), req.body.clientSecret, new MessageQueue(req.params.queue));
            consumers.push(consumer);
        }
        res.status(200).json(consumer.id);
    } catch (error) {
        console.error('An error occurred', error);
        res.sendStatus(500);
    }
});

// publish
app.post('/queues/:queue/messages', function (req, res, next) {
    try {
        var queues = consumers.findAll(c => c.queue.name === req.params.queue);
        if (queues.length > 0) {
            for (var q in queues) {
                q.Enqueue(req.body.message);
            }
        }
        var queue = queues.find(q => q.name === req.params.queue);
        if (!queue) {
            queues.push(req.params.queue);
        }
        res.sendStatus(200);
    } catch (error) {
        console.error('An error occurred', error);
        res.sendStatus(500);
    }
});

// consume
app.get('/queues/:queue/consumers/:id/messages', function (req, res, next) {
    try {
        // check if valid queue and consumer
        var queue = queues.find(q => q.name === req.params.queue);
        var consumer = consumers.find(c => c.id === req.params.id && c.queue.name === req.params.queue);
        if (queue && consumer) {
            var message = queue.Dequeue();
            message ? res.status(200).json(message) : res.sendStatus(204);
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
