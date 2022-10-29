//Tests for EventEmitter using mocha, chai and sinon
const {describe, it} = require('mocha');
const {expect} = require('chai');
const sinon = require('sinon');
const EventEmitter = require('../lib/EventEmitter');

describe('EventEmitter', () => {
    it('should emit an event', () => {
        let emitter = new EventEmitter();
        let listener = sinon.spy();
        emitter.on('test', listener);
        emitter.emit('test');
        expect(listener.called).to.be.true;
    });

    it('should emit an event with arguments', () => {
        let emitter = new EventEmitter();
        let listener = sinon.spy();
        emitter.on('test', listener);
        emitter.emit('test', 1, 2, 3);
        expect(listener.calledWith(1, 2, 3)).to.be.true;
    });

    it('should emit an event with multiple listeners', () => {
        let emitter = new EventEmitter();
        let listener1 = sinon.spy();
        let listener2 = sinon.spy();
        emitter.on('test', listener1);
        emitter.on('test', listener2);
        emitter.emit('test');
        expect(listener1.called).to.be.true;
        expect(listener2.called).to.be.true;
    });

    it('should remove a listener', () => {
        let emitter = new EventEmitter();
        let listener = sinon.spy();
        emitter.on('test', listener);
        emitter.off('test', listener);
        emitter.emit('test');
        expect(listener.called).to.be.false;
    });

    it('should listen to an event once', () => {
        let emitter = new EventEmitter();
        let listener = sinon.spy();
        emitter.once('test', listener);
        emitter.emit('test');
        emitter.emit('test');
        expect(listener.calledOnce).to.be.true;
    });

    it('should do nothing when removing a listener that does not exist', () => {
        let emitter = new EventEmitter();
        let listener = sinon.spy();
        emitter.off('test', listener);
        expect(() => emitter.off('test', listener)).to.not.throw();
    });

    it('should do nothing when emitting an event that does not exist', () => {
        let emitter = new EventEmitter();
        expect(() => emitter.emit('test')).to.not.throw();
    });
});
