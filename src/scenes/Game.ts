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

  async start() {}

  onActionPress(action: keyof typeof Keyboard.actions) {
    switch (action) {
      case "DOWN":
        if (this.door.isOpen) {
          this.door.close();
        } else {
          this.door.open();
          this.triggerGlitter();
        }
        break;
      default:
        break;
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
}
