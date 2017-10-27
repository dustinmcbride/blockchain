'use strict';

const sha256 = require('sha256');

class Block {
  constructor (index, data, prevHash) {
    this.index = index;
    this.data = data;
    this.prevHash = prevHash;
    this.timeStamp = Date.now();
    this.next = null;
  }

  buildHash () {
    return sha256(this.index + this.timeStamp + JSON.stringify(this.data) + this.prevHash);
  }
}


class BlockChain {
  constructor () {
    this.head = null;
    this.last = null;
  }

  createGenBlock () {
    if (!this.head) {
      this.head = new Block (0, {}, new Array(64).join(0));
      this.last = this.head;
    }
  }

  add (data) {
    let block = new Block(this.last.index + 1, data, this.last.buildHash());
    this.last.next = block;
    this.last = block;
    return block;
  }

  findByIndex(index) {
    let prev = this.head;
    let current = this.head.next;

    while(prev.next) {
      if (current.index === index) {
        return current;
      }
      prev = current;
      current = current.next;
    }
  }

  isValid () {
    let prev = this.head;
    let current = this.head.next;

    while(prev.next) {
      if (current.prevHash !== prev.buildHash()) {
        return false;
      }
      prev = current;
      current = current.next;
    }
    return true;
  }
}


//initialize the chain
let blockChain = new BlockChain();
blockChain.createGenBlock();

//add some blocks
for (let i = 0; i < 10000; i ++) {
  blockChain.add(`this is the data for block ${i + 1}`);
}

//check to see if chain is valid
console.log('Is chain valid: ' + blockChain.isValid());

//find a block and change it
let block = blockChain.findByIndex(2600);
block.data = `Can't touch this`;

//check to see if chain is still valid
console.log('Is chain valid: ' + blockChain.isValid());


