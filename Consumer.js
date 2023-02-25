class Consumer {

    id;
    clientSecret;
    queue;

    constructor(id, clientSecret, queue) {
        this.id = id;
        this.clientSecret = clientSecret;
        this.queues = queue;
    }
}

module.exports = Consumer;
