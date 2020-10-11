export interface ReadiableI {
  ready: Promise<void>
  setup: () => Promise<void>
}

export class Readiable implements ReadiableI {
  ready: Promise<void>;

  constructor() {
    this.ready = new Promise(async (resolve, reject) => {
      await this.setup();
      resolve();
    });
  }

  async setup(): Promise<void> {
    return;
  }
}
