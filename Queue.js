class Queue {

    name;
    root;

    constructor(name) {
        this.name = name;
    }

    Enqueue(message) {
        var node = new QueueNode(message);
        node.next = null;
        if (this.root == null) {
            this.root = node;
        } else {
            var curr = this.root;
            while (curr != null) {
                curr = curr.next;
            }
            curr = node;
        }
    }

    Dequeue() {
        if (this.root !== null) {
            var node = this.root;
            this.root = this.root.next;
            return node.message;
        } else {
            return null;
        }
    }
}