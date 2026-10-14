import type { InputState } from '../../types/game';

export class InputManager {
  private inputState: InputState = {
    up: false,
    down: false,
    left: false,
    right: false,
    interact: false,
    escape: false,
    mobile: {
      joystick: null,
      interactPressed: false,
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
    ' ': 'interact',
    Enter: 'interact',
    Escape: 'escape',
  };

  constructor() {
    this.setupKeyboardListeners();
  }

  private setupKeyboardListeners() {
    window.addEventListener('keydown', (e) => {
      const action = this.keyMap[e.key];
      if (action) {
        e.preventDefault();
        this.inputState[action] = true;
      }
    });

    window.addEventListener('keyup', (e) => {
      const action = this.keyMap[e.key];
      if (action) {
        e.preventDefault();
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

  resetInteract() {
    this.inputState.interact = false;
    if (this.inputState.mobile) {
      this.inputState.mobile.interactPressed = false;
    }
  }

  resetEscape() {
    this.inputState.escape = false;
  }
}
