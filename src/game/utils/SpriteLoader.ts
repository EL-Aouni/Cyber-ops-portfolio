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

    // Player base sprites
    this.loadSprite('player_walk_down', `${base}assets/characters/player_walk_down.png`);
    this.loadSprite('player_walk_up', `${base}assets/characters/player_walk_up.png`);
    this.loadSprite('player_walk_side', `${base}assets/characters/player_walk_side.png`);
    this.loadSprite('player_idle', `${base}assets/characters/player_idle.png`);

    // Player combat sprites
    this.loadSprite('player_attack_down', `${base}assets/characters/player_attack_down.png`);
    this.loadSprite('player_attack_side', `${base}assets/characters/player_attack_side.png`);
    this.loadSprite('player_attack_up', `${base}assets/characters/player_attack_up.png`);
    this.loadSprite('player_hurt', `${base}assets/characters/player_hurt.png`);
    this.loadSprite('player_death', `${base}assets/characters/player_death.png`);

    // NPC sprites
    this.loadSprite('npc1_idle', `${base}assets/characters/npc1_idle.png`);
    this.loadSprite('npc1_walk', `${base}assets/characters/npc1_walk.png`);

    // Enemy 1 (Malware Process / Sentry)
    this.loadSprite('enemy1_walk_down', `${base}assets/enemies/enemy1/D_Walk.png`);
    this.loadSprite('enemy1_walk_side', `${base}assets/enemies/enemy1/S_Walk.png`);
    this.loadSprite('enemy1_walk_up', `${base}assets/enemies/enemy1/U_Walk.png`);
    this.loadSprite('enemy1_idle', `${base}assets/enemies/enemy1/D_Idle.png`);
    this.loadSprite('enemy1_attack', `${base}assets/enemies/enemy1/D_Attack.png`);
    this.loadSprite('enemy1_hurt', `${base}assets/enemies/enemy1/D_Hurt.png`);
    this.loadSprite('enemy1_death', `${base}assets/enemies/enemy1/D_Death.png`);

    // Enemy 2 (Rogue Drone / Daemon)
    this.loadSprite('enemy2_walk_down', `${base}assets/enemies/enemy2/D_Walk.png`);
    this.loadSprite('enemy2_walk_side', `${base}assets/enemies/enemy2/S_Walk.png`);
    this.loadSprite('enemy2_walk_up', `${base}assets/enemies/enemy2/U_Walk.png`);
    this.loadSprite('enemy2_idle', `${base}assets/enemies/enemy2/D_Idle.png`);
    this.loadSprite('enemy2_attack', `${base}assets/enemies/enemy2/D_Attack.png`);
    this.loadSprite('enemy2_hurt', `${base}assets/enemies/enemy2/D_Hurt.png`);
    this.loadSprite('enemy2_death', `${base}assets/enemies/enemy2/D_Death.png`);

    // Animated Environment Objects
    this.loadSprite('fire1', `${base}assets/objects/Fire1.png`);
    this.loadSprite('chest1', `${base}assets/objects/Chest1_D.png`);
    this.loadSprite('chest2', `${base}assets/objects/Chest2_D.png`);
    this.loadSprite('door', `${base}assets/objects/Door_D.png`);
    this.loadSprite('spikes', `${base}assets/objects/Spikes.png`);
    this.loadSprite('lever', `${base}assets/objects/Lever1.png`);

    // Furniture
    this.loadSprite('bookshelf', `${base}assets/furniture/Bookshelf/1.png`);
    this.loadSprite('table', `${base}assets/furniture/Tables/1.png`);
    this.loadSprite('box', `${base}assets/furniture/Boxes/1.png`);

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
        // Silently resolve so missing assets do not block
        resolve();
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
