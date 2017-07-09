export default class ActivitiesRepository {
  constructor(stateManager) {
    this.stateManager = stateManager;
  }

  latestEvents(numberOfActivities) {
    const events = this.stateManager.bucket('activities');
    return events.reverse().slice(0, numberOfActivities);
  }
}
