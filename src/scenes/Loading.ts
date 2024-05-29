import { Sprite, Text } from "pixi.js";
import Scene from "../core/Scene";
import { centerObjects } from "../utils/misc";
import Background from "../prefabs/Background";

export default class Loading extends Scene {
  name = "Loading";

  private background = new Background("/assets/bg.png");

  async load() {
    await this.utils.assetLoader.loadAssetsGroup("Loading");

    const text = new Text("Loading...", {
      fontFamily: "Verdana",
      fontSize: 50,
      fill: "white",
    });

    text.resolution = 2;

    centerObjects(text);

    this.background.resize(window.innerWidth, window.innerHeight);

    this.addChild(this.background, text);
  }

  async start() {
    await this.utils.assetLoader.loadAssetsGroup("Game");
  }
}
