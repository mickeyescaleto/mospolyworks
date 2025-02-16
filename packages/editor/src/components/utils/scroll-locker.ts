import { isIosDevice } from '@repo/editor/components/utilities';

export default class ScrollLocker {
  private static CSS = {
    scrollLocked: 'ce-scroll-locked',
    scrollLockedHard: 'ce-scroll-locked--hard',
  };

  private scrollPosition: null | number = null;

  public lock(): void {
    if (isIosDevice) {
      this.lockHard();
    } else {
      document.body.classList.add(ScrollLocker.CSS.scrollLocked);
    }
  }

  public unlock(): void {
    if (isIosDevice) {
      this.unlockHard();
    } else {
      document.body.classList.remove(ScrollLocker.CSS.scrollLocked);
    }
  }

  private lockHard(): void {
    this.scrollPosition = window.pageYOffset;
    document.documentElement.style.setProperty(
      '--window-scroll-offset',
      `${this.scrollPosition}px`,
    );
    document.body.classList.add(ScrollLocker.CSS.scrollLockedHard);
  }

  private unlockHard(): void {
    document.body.classList.remove(ScrollLocker.CSS.scrollLockedHard);
    if (this.scrollPosition !== null) {
      window.scrollTo(0, this.scrollPosition);
    }
    this.scrollPosition = null;
  }
}
