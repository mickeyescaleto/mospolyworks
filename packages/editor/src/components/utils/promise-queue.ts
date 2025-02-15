export default class PromiseQueue {
  public completed = Promise.resolve();

  public add(
    operation: (value: void) => void | PromiseLike<void>,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      this.completed = this.completed
        .then(operation)
        .then(resolve)
        .catch(reject);
    });
  }
}
