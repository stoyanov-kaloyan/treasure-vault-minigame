import Scene from "../core/Scene";
import { Wheel } from "../prefabs/Wheel";
import Background from "../prefabs/Background";
import { Door } from "../prefabs/Door";

export default class Game extends Scene {
  name = "Game";

  private background!: Background;
  private wheel!: Wheel;
  private door!: Door;

  load() {
    this.background = new Background("/assets/bg.png");
    this.wheel = new Wheel();
    this.door = new Door();

    this.wheel.x = window.innerWidth / 2 - 4;
    this.wheel.y = window.innerHeight / 2 - 10;

    this.door.x = window.innerWidth / 2 + 20;
    this.door.y = window.innerHeight / 2 - 10;

    this.addChild(this.background, this.door, this.wheel);
  }

  async start() {}

  onResize(width: number, height: number) {
    if (this.wheel) {
      this.wheel.x = width / 2 - 4;
      this.wheel.y = height / 2 - 10;
    }

    if (this.door) {
      this.door.x = width / 2 + 20;
      this.door.y = height / 2 - 10;
    }

    if (this.background) {
      this.background.resize(width, height);
    }
  }
}
