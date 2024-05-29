import { Container, Sprite, Texture } from "pixi.js";

export class Door extends Container {
  private sprite: Sprite;

  constructor() {
    super();

    this.sprite = new Sprite(Texture.from("/assets/door.png"));

    this.sprite.anchor.set(0.5);

    this.scale.set(0.3);

    this.addChild(this.sprite);
  }
}
