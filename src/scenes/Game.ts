import config from "../config";
import ParallaxBackground from "../prefabs/ParallaxBackground";
import Scene from "../core/Scene";
import { Wheel } from "../prefabs/Wheel";

export default class Game extends Scene {
  name = "Game";

  private background!: ParallaxBackground;
  private wheel!: Wheel;

  load() {
    this.background = new ParallaxBackground(config.backgrounds.forest);
    this.wheel = new Wheel();

    this.wheel.x = window.innerWidth / 2;
    this.wheel.y = window.innerHeight / 2;

    // this.background.initPlayerMovement(this.player);

    // this.addChild(this.background, this.player);
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
