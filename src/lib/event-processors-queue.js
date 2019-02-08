export default class EventProcessorsQueue {
  constructor(params = {}) {
    this.processors = params.processors || [];
  }

  push(processor) {
    this.processors.push(processor);
  }

  processEvent(event) {
    let queue = Promise.resolve();
    this.processors.forEach((processor) => {
      if (this.processorHandlesEvent(processor, event)) {
        queue = queue.then(() => processor.processEvent(event));
      }
    });
    return queue;
  }

  // private

  processorHandlesEvent(processor, event) {
    return (processor.handleEvents().indexOf(event.type) !== -1);
  }
}
