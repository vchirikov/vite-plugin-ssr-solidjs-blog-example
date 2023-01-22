class PageDisposer {
  private currentDispose?: () => void;

  /** Runs stored dispose function, use this before render or hydrate to cleanup previous page render result */
  public dispose(): void {
    if (this.currentDispose) {
      this.currentDispose();
      this.currentDispose = undefined;
    }
  }

  /** Sets current page dispose function */
  public set(dispose: () => void): void {
    this.currentDispose = dispose;
  }
}

const pageDisposer = new PageDisposer();

export { pageDisposer };
