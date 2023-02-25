class QueueNode {

    message;
    next;

    constructor(message, next) {
        this.message = message;
        this.next = next;
    }
}

module.exports = QueueNode;
