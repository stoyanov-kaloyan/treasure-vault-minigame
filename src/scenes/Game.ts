import Scene from "../core/Scene";
import { Wheel } from "../prefabs/Wheel";
import Background from "../prefabs/Background";
import { Door } from "../prefabs/Door";
import { GlitterEffect } from "../prefabs/GlitterEffect";
import Keyboard from "../core/Keyboard";

export default class Game extends Scene {
  name = "Game";

  private background!: Background;
  private wheel!: Wheel;
  private door!: Door;

  private code: Array<number> = [];
  private playerCode: Array<number> = [];
  private lastDirection: string = "";

  private resetting: boolean = false;

  private keyboard = Keyboard.getInstance();

  load() {
    this.background = new Background("/assets/bg.png");
    this.wheel = new Wheel();
    this.door = new Door();

    this.wheel.x = window.innerWidth / 2 - 4;
    this.wheel.y = window.innerHeight / 2 - 10;

    this.door.x = window.innerWidth / 2 + 20;
    this.door.y = window.innerHeight / 2 - 10;

    this.wheel.scale.set(this.background.scalingFactor);
    this.door.scale.set(this.background.scalingFactor);

    this.addChild(this.background);
    this.addChild(this.door);
    this.addChild(this.wheel);

    this.keyboard.onAction(({ action, buttonState }) => {
      if (buttonState === "pressed") this.onActionPress(action);
    });
  }

  async start() {
    this.generateCode();
  }

  onActionPress(action: keyof typeof Keyboard.actions) {
    if (this.resetting) return;
    switch (action) {
      case "LEFT":
        this.input("LEFT");
        this.lastDirection = "LEFT";
        this.wheel.rotateLeft();
        break;
      case "RIGHT":
        this.input("RIGHT");
        this.lastDirection = "RIGHT";
        this.wheel.rotateRight();
        break;
      default:
        break;
    }
  }

  input(direction: string) {
    if (this.lastDirection === direction) {
      if (this.lastDirection === "RIGHT") {
        this.playerCode[this.playerCode.length - 1] =
          this.playerCode[this.playerCode.length - 1] + 1;
      } else if (this.lastDirection === "LEFT") {
        this.playerCode[this.playerCode.length - 1] =
          this.playerCode[this.playerCode.length - 1] - 1;
      }
    } else {
      if (direction === "RIGHT") {
        this.playerCode.push(1);
      } else {
        this.playerCode.push(-1);
      }
    }
    this.checkWin();
  }

  checkWin() {
    if (this.playerCode.length < 3) {
      return;
    }
    let playerCode = this.playerCode.slice(-3);
    if (
      playerCode[0] === this.code[0] &&
      playerCode[1] === this.code[1] &&
      playerCode[2] === this.code[2]
    ) {
      setTimeout(() => {
        this.triggerWin();
      }, 500);
    }
  }

  onResize(width: number, height: number) {
    if (this.wheel) {
      this.wheel.x = width / 2 - 4;
      this.wheel.y = height / 2 - 10;
      this.wheel.scale.set(this.background.scalingFactor);
    }

    if (this.door) {
      this.door.x = width / 2 + 20;
      this.door.y = height / 2 - 10;
      this.door.scale.set(this.background.scalingFactor);
    }

    if (this.background) {
      this.background.resize(width, height);
    }
  }

  triggerGlitter() {
    const glitter = new GlitterEffect("/assets/blink.png", 3);
    this.addChild(glitter);
  }

  generateCode() {
    let code = [];
    let codeString = "";
    this.lastDirection = "";

    for (let i = 0; i < 3; i++) {
      code.push(Math.round(Math.random() * 8 + 1));
      if (i === 1) {
        code[i] = -code[i];
      }
      codeString +=
        Math.abs(code[i]).toString() +
        " " +
        (code[i] < 0 ? "counterclockwise " : "clockwise ");
    }

    console.log(codeString);
    this.code = code;
  }

  triggerWin() {
    this.door.open();
    this.wheel.open();
    this.triggerGlitter();
    this.resetting = true;
    setTimeout(() => {
      this.door.close();
      this.wheel.close();
      this.wheel.reloadAnimation().then(() => {
        this.resetting = false;
      });
      this.generateCode();
    }, 3000);
  }
}
