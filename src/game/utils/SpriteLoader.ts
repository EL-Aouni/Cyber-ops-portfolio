// Sprite loader for real pixel art assets
export class SpriteLoader {
  private sprites: Map<string, HTMLImageElement> = new Map();
  private loaded: boolean = false;
  private loadPromises: Promise<void>[] = [];

  constructor() {
    this.loadAllSprites();
  }

  private loadAllSprites() {
    const base = import.meta.env.BASE_URL || '/';

    // Player sprites
    this.loadSprite('player_walk_down', `${base}assets/characters/player_walk_down.png`);
    this.loadSprite('player_walk_up', `${base}assets/characters/player_walk_up.png`);
    this.loadSprite('player_walk_side', `${base}assets/characters/player_walk_side.png`);
    this.loadSprite('player_idle', `${base}assets/characters/player_idle.png`);

    // NPC sprites
    this.loadSprite('npc1_idle', `${base}assets/characters/npc1_idle.png`);
    this.loadSprite('npc1_walk', `${base}assets/characters/npc1_walk.png`);

    // Tiles
    this.loadSprite('floor', `${base}assets/tiles/floor.png`);
    this.loadSprite('wall', `${base}assets/tiles/wall.png`);

    // Objects
    this.loadSprite('objects_sheet', `${base}assets/objects/objects_sheet.png`);
  }

  private loadSprite(key: string, path: string) {
    const promise = new Promise<void>((resolve) => {
      const img = new Image();
      img.onload = () => {
        this.sprites.set(key, img);
        resolve();
      };
      img.onerror = () => {
        console.warn(`Failed to load sprite: ${path}`);
        resolve(); // Don't block on missing sprites
      };
      img.src = path;
    });
    this.loadPromises.push(promise);
  }

  async waitForLoad(): Promise<void> {
    await Promise.all(this.loadPromises);
    this.loaded = true;
    console.log(`Loaded ${this.sprites.size} sprites`);
  }

  getSprite(key: string): HTMLImageElement | undefined {
    return this.sprites.get(key);
  }

  isLoaded(): boolean {
    return this.loaded;
  }
}
