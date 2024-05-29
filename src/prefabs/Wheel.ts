import { Container, Sprite, Texture } from "pixi.js";
import Keyboard from "../core/Keyboard";
import gsap from "gsap";

export class Wheel extends Container {
  private keyboard = Keyboard.getInstance();
  private rotationAngle: number = 0;
  private sprite: Sprite;

  constructor() {
    super();

    this.sprite = new Sprite(Texture.from("/assets/handle.png"));

    this.sprite.anchor.set(0.5);

    this.scale.set(0.5);

    this.addChild(this.sprite);

    this.keyboard.onAction(({ action, buttonState }) => {
      if (buttonState === "pressed") this.onActionPress(action);
    });
  }

  private onActionPress(action: keyof typeof Keyboard.actions) {
    switch (action) {
      case "LEFT":
        this.rotateSprite(-60);
        break;
      case "RIGHT":
        this.rotateSprite(60);
        break;
      default:
        break;
    }
  }

  private rotateSprite(angle: number) {
    this.rotationAngle += angle;
    const rotationAngleInRadians = this.rotationAngle * (Math.PI / 180);
    gsap.to(this, { rotation: rotationAngleInRadians, duration: 0.5 });
  }
}