class QueueNode {

    message;
    next;

    constructor(message) {
        this.message = message;
        this.next = null;
    }
}

module.exports = QueueNode;
