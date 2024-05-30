import { Container, Sprite, Texture } from "pixi.js";
import gsap from "gsap";

export class Door extends Container {
  private sprite: Sprite;
  public isOpen: boolean = false;

  constructor() {
    super();

    this.sprite = new Sprite(Texture.from("/assets/door.png"));

    this.sprite.anchor.set(0.5);

    this.scale.set(0.3);

    this.addChild(this.sprite);
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
}
