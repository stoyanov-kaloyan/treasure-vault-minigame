import { Container, Texture } from "pixi.js";
import { Particle } from "./Particle";

export class GlitterEffect extends Container {
  private particles: Particle[] = [];

  constructor(texturePath: string, particleCount: number) {
    super();

    const texture = Texture.from(texturePath);

    for (let i = 0; i < particleCount; i++) {
      const particle = new Particle(texture);
      particle.x = Math.random() * 120 + (window.innerWidth / 2) * 0.75;
      particle.y = Math.random() * 120 + window.innerHeight / 2;
      this.addChild(particle);
      this.particles.push(particle);
      particle.animate();
    }
  }
}
