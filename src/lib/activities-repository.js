export default class ActivitiesRepository {
  constructor(stateManager) {
    this.stateManager = stateManager;
  }

  latestEvents(numberOfActivities) {
    const bucket = this.stateManager.bucket('activities');
    return bucket.slice(0, numberOfActivities);
  }
}
