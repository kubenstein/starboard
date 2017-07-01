import { hasToBeSet } from './utils.js';

export default class EventProcessorsQueue {
  constructor(params = {}) {
    this.stateManager = params.stateManager || hasToBeSet('stateManager');
    this.processors = params.processors || [];
  }

  push(processor) {
    this.processors.push(processor);
  }

  processEvent(event) {
    let queue = Promise.resolve();
    this.processors.forEach((processor) => {
      if (this.processorHandlesEvent(processor, event)) {
        queue = queue.then(() => {
          return processor.processEvent(this.stateManager, event);
        });
      }
    });
    return queue;
  }

  // private

  processorHandlesEvent(processor, event) {
    return (processor.handleEvents().indexOf(event.type) !== -1);
  }
}
