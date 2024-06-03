import Scene from "../core/Scene";
import { Wheel } from "../prefabs/Wheel";
import Background from "../prefabs/Background";
import { Door } from "../prefabs/Door";
import { GlitterEffect } from "../prefabs/GlitterEffect";
import Keyboard from "../core/Keyboard";
import { BitmapFont, BitmapText } from "pixi.js";
import { wait } from "../utils/misc";

export default class Game extends Scene {
  name = "Game";

  private background!: Background;
  private wheel!: Wheel;
  private door!: Door;
  private timer!: BitmapText;

  private code: Array<number> = [];
  private playerCode: Array<number> = [];
  private lastDirection: string = "";

  private resetting: boolean = false;

  private keyboard = Keyboard.getInstance();

  private animating: boolean = false;

  private time = 0;
  private timerStopped = false;

  private sequenceLength: number = 3;

  load() {
    this.background = new Background("/assets/bg.png");
    this.wheel = new Wheel();
    this.door = new Door();

    this.wheel.x = window.innerWidth / 2 - 10;
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

    this.eventMode = "dynamic";
    this.on("pointerdown", this.onPointerDown.bind(this));

    BitmapFont.from(
      "TitleFont",
      {
        fontFamily: "Verdana",
        fontSize: 16,
        strokeThickness: 2,
        fill: "white",
      },
      {
        chars: [":", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
        resolution: 5,
      }
    );

    this.timer = new BitmapText("00:00", {
      fontName: "TitleFont",
    });

    //position timer based on scaling factor
    console.log(this.background.scalingFactor);
    this.timer.y = window.innerHeight / 2 - this.background.scalingFactor * 180;
    this.timer.x = window.innerWidth / 2 - this.background.scalingFactor * 1260;

    this.background.addChild(this.timer);
  }

  update(delta: number) {
    if (this.timerStopped) return;
    this.time += delta;

    const minutes = Math.floor(this.time / 60000);
    const seconds = Math.floor((this.time % 60000) / 1000);

    const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;

    this.timer.text = formattedTime;
  }

  async start() {
    this.generateCode();
  }

  onPointerDown(event: any) {
    const clickX = event.data.global.x;
    const screenWidth = window.innerWidth;

    if (this.resetting) return;
    if (clickX < screenWidth / 2) {
      this.input("LEFT");
      this.lastDirection = "LEFT";
      this.wheel.rotateLeft();
    } else {
      this.input("RIGHT");
      this.lastDirection = "RIGHT";
      this.wheel.rotateRight();
    }
  }

  async onActionPress(action: keyof typeof Keyboard.actions) {
    if (this.resetting || this.animating) return;
    switch (action) {
      case "LEFT":
        this.animating = true;
        await this.wheel.rotateLeft();
        this.input("LEFT");
        this.lastDirection = "LEFT";
        this.animating = false;
        break;
      case "RIGHT":
        this.animating = true;
        await this.wheel.rotateRight();
        this.input("RIGHT");
        this.lastDirection = "RIGHT";
        this.animating = false;
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
      if (
        Math.abs(this.playerCode[this.playerCode.length - 1]) >
        Math.abs(this.code[this.playerCode.length - 1])
      ) {
        this.triggerLoss();
      }
    } else {
      if (direction === "RIGHT") {
        this.playerCode.push(1);
      } else {
        if (this.playerCode.length === 0) {
          this.triggerLoss();
        }
        this.playerCode.push(-1);
      }
      if (
        this.playerCode.length > 1 &&
        Math.abs(this.playerCode[this.playerCode.length - 2]) <
          Math.abs(this.code[this.playerCode.length - 2])
      ) {
        this.triggerLoss();
      }
    }
    this.checkWin();
  }

  async checkWin() {
    if (this.playerCode.length < this.sequenceLength) {
      return;
    }
    let playerCode = this.playerCode;
    let isWin = true;
    for (let i = 0; i < this.sequenceLength; i++) {
      if (playerCode[i] !== this.code[i]) {
        isWin = false;
        break;
      }
    }
    if (isWin) {
      this.resetting = true;
      await wait(0.3);
      this.triggerWin();
    }
  }

  async triggerLoss() {
    this.timerStopped = true;
    this.playerCode = [];
    this.lastDirection = "";
    this.resetting = true;
    await this.wheel.reloadAnimation();
    this.resetting = false;
    this.generateCode();
    this.time = 0;
    this.timerStopped = false;
  }

  onResize(width: number, height: number) {
    if (this.wheel) {
      this.wheel.x = width / 2 - 10;
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
    if (this.timer) {
      this.timer.y =
        window.innerHeight / 2 - this.background.scalingFactor * 180;
      this.timer.x =
        window.innerWidth / 2 - this.background.scalingFactor * 1260;
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

    for (let i = 0; i < this.sequenceLength; i++) {
      code.push(Math.round(Math.random() * 8 + 1));
      if (i % 2 === 1) {
        code[i] = -code[i];
      }
      codeString +=
        Math.abs(code[i]).toString() +
        " " +
        (code[i] < 0 ? "counterclockwise " : "clockwise ");
    }

    console.log("Code: ", codeString);
    this.code = code;
  }

  async triggerWin() {
    this.timerStopped = true;
    this.door.open();
    this.wheel.open();
    this.triggerGlitter();
    this.lastDirection = "";
    await wait(3);
    this.door.close();
    this.wheel.close();
    await this.wheel.reloadAnimation();
    this.resetting = false;
    this.playerCode = [];
    this.generateCode();
    this.time = 0;
    this.timerStopped = false;
  }
}
