import { Container, Sprite, Texture } from "pixi.js";
import Keyboard from "../core/Keyboard";
import gsap from "gsap";

export class Door extends Container {
  private keyboard = Keyboard.getInstance();
  private sprite: Sprite;
  private isOpen: boolean = false;

  constructor() {
    super();

    this.sprite = new Sprite(Texture.from("/assets/door.png"));

    this.sprite.anchor.set(0.5);

    this.scale.set(0.3);

    this.addChild(this.sprite);

    this.keyboard.onAction(({ action, buttonState }) => {
      if (buttonState === "pressed") this.onActionPress(action);
    });
  }

  open() {
    this.sprite.texture = Texture.from("/assets/doorOpen.png");
    this.isOpen = true;
    gsap.to(this.sprite, { rotation: Math.PI, duration: 0 });
    this.sprite.anchor.set(0.8, 0.53);
  }

  close() {
    this.sprite.texture = Texture.from("/assets/door.png");
    this.isOpen = false;
    gsap.to(this.sprite, { rotation: 0, duration: 0 });
    this.sprite.anchor.set(0.5);
  }

  private onActionPress(action: keyof typeof Keyboard.actions) {
    switch (action) {
      case "DOWN":
        this.isOpen ? this.close() : this.open();
        break;
      default:
        break;
    }
  }
}
