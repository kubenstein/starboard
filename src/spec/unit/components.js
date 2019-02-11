import * as lib from '../../lib';

const { MemoryEventStorage, State, eventDefinitions } = lib;
const storage = new MemoryEventStorage();
const state = new State({ eventStorage: storage });

export {
  state,
  eventDefinitions,
  lib,
};
