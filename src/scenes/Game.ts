import Scene from "../core/Scene";
import { Wheel } from "../prefabs/Wheel";
import Background from "../prefabs/Background";

export default class Game extends Scene {
  name = "Game";

  private background!: Background;
  private wheel!: Wheel;

  load() {
    this.background = new Background("/assets/bg.png");
    this.wheel = new Wheel();

    this.wheel.x = window.innerWidth / 2;
    this.wheel.y = window.innerHeight / 2;

    this.addChild(this.background, this.wheel);
  }

  async start() {}

  onResize(width: number, height: number) {
    if (this.wheel) {
      this.wheel.x = width / 2;
      this.wheel.y = height / 2;
    }

    if (this.background) {
      this.background.resize(width, height);
    }
  }
}
