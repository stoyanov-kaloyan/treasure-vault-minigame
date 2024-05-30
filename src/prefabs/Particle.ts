import { Sprite, Texture } from "pixi.js";
import gsap from "gsap";

export class Particle extends Sprite {
  constructor(texture: Texture) {
    super(texture);
    this.anchor.set(0.5);
  }

  animate() {
    const duration = Math.random() * 0.6 + 1;
    const delay = Math.random() * 2;

    gsap.to(this, {
      x: this.x + (Math.random() - 0.5) * 100,
      y: this.y + (Math.random() - 0.5) * 100,
      alpha: 0,
      scale: Math.random() * 0.5 + 0.2,
      duration: duration,
      delay: delay,
      onComplete: () => {
        this.parent?.removeChild(this);
      },
    });
  }
}
