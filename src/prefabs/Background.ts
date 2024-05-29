import { Container, Sprite, Texture } from "pixi.js";

export default class StaticBackground extends Container {
  private sprite: Sprite;

  public scalingFactor: number = 1;

  constructor(imagePath: string) {
    super();

    const texture = Texture.from(imagePath);

    this.sprite = new Sprite(texture);

    this.sprite.anchor.set(0.5);

    this.addChild(this.sprite);

    this.resize(window.innerWidth, window.innerHeight);
  }

  resize(width: number, height: number) {
    const scaleFactor = Math.max(
      width / this.sprite.texture.width,
      height / this.sprite.texture.height
    );

    console.log("scaleFactor", scaleFactor);

    this.scalingFactor = scaleFactor;

    this.sprite.width = this.sprite.texture.width * scaleFactor;
    this.sprite.height = this.sprite.texture.height * scaleFactor;

    this.sprite.x = width / 2;
    this.sprite.y = height / 2;
  }
}
