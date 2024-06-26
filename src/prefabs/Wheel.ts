import { Container, Sprite, Texture } from "pixi.js";
import gsap from "gsap";

export class Wheel extends Container {
  private rotationAngle: number = 0;
  private sprite: Sprite;
  private shadow: Sprite;
  private isOpen: boolean = false;

  constructor() {
    super();

    this.sprite = new Sprite(Texture.from("/assets/handle.png"));
    this.sprite.anchor.set(0.5, 0.5);

    this.shadow = new Sprite(Texture.from("/assets/handleShadow.png"));
    this.shadow.anchor.set(0.5, 0.5);
    this.shadow.alpha = 0.75;
    this.shadow.position.set(30, 30);

    // this.scale.set(0.3);

    this.addChild(this.shadow);
    this.addChild(this.sprite);
  }

  public rotateLeft() {
    return this.rotateSprite(-60);
  }

  public rotateRight() {
    return this.rotateSprite(60);
  }

  private rotateSprite(angle: number): Promise<void> {
    return new Promise((resolve) => {
      this.rotationAngle += angle;
      const rotationAngleInRadians = this.rotationAngle * (Math.PI / 180);

      gsap.to(this.sprite, {
        rotation: rotationAngleInRadians,
        duration: 0.3,
        onComplete: () => {
          resolve();
        },
      });
      gsap.to(this.shadow, { rotation: rotationAngleInRadians, duration: 0.3 });
    });
  }

  public reloadAnimation(): Promise<void> {
    return new Promise((resolve) => {
      this.rotationAngle += 1200;
      let angleInRadians = this.rotationAngle * (Math.PI / 180);
      gsap.to(this.sprite, {
        rotation: angleInRadians,
        duration: 3,
        onComplete: () => {
          resolve();
        },
      });
      gsap.to(this.shadow, {
        rotation: angleInRadians,
        duration: 3,
      });
    });
  }

  public open() {
    this.isOpen = true;
    gsap.to(this.sprite, { rotation: 0, duration: 0 });
    gsap.to(this.shadow, { rotation: 0, duration: 0 });
    this.sprite.anchor.set(-3.43, 0.5);
    this.shadow.anchor.set(-3.3, 0.52);
    this.shadow.scale.x = 0.3;
    this.sprite.scale.x = 0.3;
    this.sprite.scale.y = 0.9;
    this.shadow.scale.y = 0.9;
  }

  public close() {
    this.isOpen = false;
    gsap.to(this.sprite, { rotation: 0, duration: 0 });
    gsap.to(this.shadow, { rotation: 0, duration: 0 });
    this.sprite.anchor.set(0.5, 0.5);
    this.shadow.anchor.set(0.5, 0.5);
    this.sprite.scale.x = 1;
    this.shadow.scale.x = 1;
    this.sprite.scale.y = 1;
    this.shadow.scale.y = 1;
  }
}
