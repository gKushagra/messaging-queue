const QueueNode = require("./QueueNode");

class MessageQueue {

    name;
    root;

    constructor(name) {
        this.name = name;
        this.root = null;
    }

    Enqueue(message) {
        if (this.root === null) {
            this.root = new QueueNode(message);
            return;
        }
        if (this.root.next === null) {
            this.root.next = new QueueNode(message);
            return;
        }
        var currNode = this.root;
        while(currNode.next !== null) {
            currNode = currNode.next;
        }
        currNode.next = new QueueNode(message);
    }

    Dequeue() {
        if (this.root != null) {
            var node = this.root;
            this.root = this.root.next;
            return node.message;
        } else {
            return null;
        }
    }
}

module.exports = MessageQueue;
