import type { InputState } from '../../types/game';

export class InputManager {
  private inputState: InputState = {
    up: false,
    down: false,
    left: false,
    right: false,
    interact: false,
    attack: false,
    escape: false,
    mobile: {
      joystick: null,
      interactPressed: false,
      attackPressed: false,
    },
  };

  private keyMap: { [key: string]: keyof Omit<InputState, 'mobile'> } = {
    w: 'up',
    W: 'up',
    ArrowUp: 'up',
    s: 'down',
    S: 'down',
    ArrowDown: 'down',
    a: 'left',
    A: 'left',
    ArrowLeft: 'left',
    d: 'right',
    D: 'right',
    ArrowRight: 'right',
    e: 'interact',
    E: 'interact',
    f: 'attack',
    F: 'attack',
    ' ': 'attack',
    Enter: 'interact',
    Escape: 'escape',
  };

  constructor() {
    this.setupKeyboardListeners();
  }

  private isInputElement(target: EventTarget | null): boolean {
    if (!target) return false;
    const el = target as HTMLElement;
    const tagName = el.tagName?.toLowerCase();
    return tagName === 'input' || tagName === 'textarea' || el.isContentEditable;
  }

  private setupKeyboardListeners() {
    window.addEventListener('keydown', (e) => {
      // If typing inside an input field or textarea, let it handle the typing!
      if (this.isInputElement(e.target)) {
        if (e.key === 'Escape') {
          this.inputState.escape = true;
        }
        return;
      }

      const action = this.keyMap[e.key];
      if (action) {
        // Prevent scrolling for arrows, space
        if ([' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
          e.preventDefault();
        }
        this.inputState[action] = true;
      }
    });

    window.addEventListener('keyup', (e) => {
      if (this.isInputElement(e.target)) {
        return;
      }

      const action = this.keyMap[e.key];
      if (action) {
        this.inputState[action] = false;
      }
    });
  }

  getInputState(): InputState {
    return { ...this.inputState };
  }

  setMobileJoystick(direction: { x: number; y: number } | null) {
    if (this.inputState.mobile) {
      this.inputState.mobile.joystick = direction;
    }
  }

  setMobileInteract(pressed: boolean) {
    if (this.inputState.mobile) {
      this.inputState.mobile.interactPressed = pressed;
    }
  }

  setMobileAttack(pressed: boolean) {
    if (this.inputState.mobile) {
      this.inputState.mobile.attackPressed = pressed;
    }
  }

  resetInteract() {
    this.inputState.interact = false;
    if (this.inputState.mobile) {
      this.inputState.mobile.interactPressed = false;
    }
  }

  resetAttack() {
    this.inputState.attack = false;
    if (this.inputState.mobile) {
      this.inputState.mobile.attackPressed = false;
    }
  }

  resetEscape() {
    this.inputState.escape = false;
  }
}
