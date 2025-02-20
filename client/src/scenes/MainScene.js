import { socket } from "../services/socket";

export default class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: "MainScene" });
    this.players = new Map();
    this.localPlayerId = null;
  }

  preload() {
    // Load the tilemap JSON file - updated for latest Phaser
    this.load.tilemapTiledJSON("map", "assets/maps/level.json");

    // Load the tileset image
    this.load.image("plains", "assets/maps/plains.png");

    // Load existing sprite sheets
    this.load.spritesheet("player1", "assets/player1.png", {
      frameWidth: 48,
      frameHeight: 48,
    });
    this.load.spritesheet("player2", "assets/player2.png", {
      frameWidth: 48,
      frameHeight: 48,
    });
    this.load.spritesheet("slime", "assets/slime.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
  }

  create() {
    // Create the tilemap
    const map = this.make.tilemap({ key: "map" });

    // Add the tileset image to the map
    const tileset = map.addTilesetImage("plains", "plains");

    // Create the layers
    const layer1 = map.createLayer("Tile Layer 1", tileset, 0, 0);
    const layer2 = map.createLayer("Tile Layer 2", tileset, 0, 0);

    // Scale the map to match your game's scale (if needed)
    layer1.setScale(1);
    layer2.setScale(1);

    this.players = new Map();
    this.cursors = this.input.keyboard.createCursorKeys();

    // Create animations for both player sprites
    ["player1", "player2"].forEach((spriteId) => {
      // Create animations for this sprite
      this.anims.create({
        key: `${spriteId}_idleDown`,
        frames: this.anims.generateFrameNumbers(spriteId, { start: 0, end: 5 }),
        frameRate: 10,
        repeat: -1,
      });

      this.anims.create({
        key: `${spriteId}_idleRight`,
        frames: this.anims.generateFrameNumbers(spriteId, {
          start: 6,
          end: 11,
        }),
        frameRate: 10,
        repeat: -1,
      });

      this.anims.create({
        key: `${spriteId}_idleUp`,
        frames: this.anims.generateFrameNumbers(spriteId, {
          start: 12,
          end: 17,
        }),
        frameRate: 10,
        repeat: -1,
      });

      this.anims.create({
        key: `${spriteId}_walkDown`,
        frames: this.anims.generateFrameNumbers(spriteId, {
          start: 18,
          end: 23,
        }),
        frameRate: 10,
        repeat: -1,
      });

      this.anims.create({
        key: `${spriteId}_walkRight`,
        frames: this.anims.generateFrameNumbers(spriteId, {
          start: 24,
          end: 29,
        }),
        frameRate: 10,
        repeat: -1,
      });

      this.anims.create({
        key: `${spriteId}_walkUp`,
        frames: this.anims.generateFrameNumbers(spriteId, {
          start: 30,
          end: 35,
        }),
        frameRate: 10,
        repeat: -1,
      });

      this.anims.create({
        key: `${spriteId}_attackDown`,
        frames: this.anims.generateFrameNumbers(spriteId, {
          start: 36,
          end: 39,
        }),
        frameRate: 10,
        repeat: -1,
      });

      this.anims.create({
        key: `${spriteId}_attackRight`,
        frames: this.anims.generateFrameNumbers(spriteId, {
          start: 42,
          end: 45,
        }),
        frameRate: 10,
        repeat: -1,
      });

      this.anims.create({
        key: `${spriteId}_attackUp`,
        frames: this.anims.generateFrameNumbers(spriteId, {
          start: 48,
          end: 51,
        }),
        frameRate: 10,
        repeat: -1,
      });

      this.anims.create({
        key: `${spriteId}_die`,
        frames: this.anims.generateFrameNumbers(spriteId, {
          start: 54,
          end: 56,
        }),
        frameRate: 10,
        repeat: 0,
      });
    });

    // Create slime animations
    this.anims.create({
      key: "slimeIdleDown",
      frames: this.anims.generateFrameNumbers("slime", { start: 0, end: 3 }),
      frameRate: 5,
      repeat: -1,
    });

    this.anims.create({
      key: "slimeIdleRight",
      frames: this.anims.generateFrameNumbers("slime", { start: 7, end: 10 }),
      frameRate: 5,
      repeat: -1,
    });

    this.anims.create({
      key: "slimeIdleUp",
      frames: this.anims.generateFrameNumbers("slime", { start: 14, end: 17 }),
      frameRate: 5,
      repeat: -1,
    });

    this.anims.create({
      key: "slimeHopDown",
      frames: this.anims.generateFrameNumbers("slime", { start: 21, end: 26 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "slimeHopRight",
      frames: this.anims.generateFrameNumbers("slime", { start: 28, end: 33 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "slimeHopUp",
      frames: this.anims.generateFrameNumbers("slime", { start: 35, end: 40 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "slimeJumpDown",
      frames: this.anims.generateFrameNumbers("slime", { start: 42, end: 48 }),
      frameRate: 15,
      repeat: -1,
    });

    this.anims.create({
      key: "slimeJumpRight",
      frames: this.anims.generateFrameNumbers("slime", { start: 49, end: 55 }),
      frameRate: 15,
      repeat: -1,
    });

    this.anims.create({
      key: "slimeJumpUp",
      frames: this.anims.generateFrameNumbers("slime", { start: 56, end: 62 }),
      frameRate: 15,
      repeat: -1,
    });

    this.anims.create({
      key: "slimeConfuseDown",
      frames: this.anims.generateFrameNumbers("slime", { start: 63, end: 65 }),
      frameRate: 5,
      repeat: -1,
    });

    this.anims.create({
      key: "slimeConfuseRight",
      frames: this.anims.generateFrameNumbers("slime", { start: 66, end: 68 }),
      frameRate: 5,
      repeat: -1,
    });

    this.anims.create({
      key: "slimeConfuseUp",
      frames: this.anims.generateFrameNumbers("slime", { start: 69, end: 71 }),
      frameRate: 5,
      repeat: -1,
    });

    this.anims.create({
      key: "slimeDie",
      frames: this.anims.generateFrameNumbers("slime", { start: 72, end: 76 }),
      frameRate: 10,
      repeat: 0,
    });

    this.slimes = this.physics.add.group();

    for (let i = 0; i < 10; i++) {
      const x = Phaser.Math.Between(0, 800);
      const y = Phaser.Math.Between(0, 600);
      const slime = this.slimes.create(x, y, "slime");
      slime.play("slimeIdleDown");
    }

    socket.on("gameState", (gameState) => {
      // Update or create players
      gameState.players.forEach((playerData) => {
        let player = this.players.get(playerData.id);

        if (!player) {
          player = this.physics.add.sprite(
            playerData.x,
            playerData.y,
            playerData.spriteId
          );
          player.setScale(1.5);

          if (playerData.id === socket.id) {
            this.localPlayerId = playerData.id;
            this.cameras.main.startFollow(player);
            this.cameras.main.setFollowOffset(
              -player.width / 2,
              -player.height / 2
            );
          }

          const displayName = playerData.name || "Player";
          const playerText = this.add.text(
            playerData.x,
            playerData.y - 40,
            displayName,
            {
              fontSize: "16px",
              fill: "#ffffff",
              backgroundColor: "#000000",
              padding: { x: 4, y: 4 },
            }
          );
          playerText.setOrigin(0.5);
          player.playerText = playerText;

          this.players.set(playerData.id, player);
        }

        // Update player position and animation
        player.x = playerData.x;
        player.y = playerData.y;
        player.playerText.x = playerData.x;
        player.playerText.y = playerData.y - 40;

        if (playerData.animation) {
          player.anims.play(
            `${playerData.spriteId}_${playerData.animation}`,
            true
          );
          player.flipX = playerData.flipX;
        }
      });

      // Remove disconnected players
      const currentPlayerIds = gameState.players.map((p) => p.id);
      Array.from(this.players.keys()).forEach((playerId) => {
        if (!currentPlayerIds.includes(playerId)) {
          const player = this.players.get(playerId);
          player.playerText.destroy(); // Destroy the text object
          player.destroy();
          this.players.delete(playerId);
        }
      });

      // Update slimes
      gameState.slimes.forEach((slimeData, index) => {
        let slime = this.slimes.getChildren()[index];
        if (!slime) {
          slime = this.slimes.create(slimeData.x, slimeData.y, "slime");
        }
        slime.x = slimeData.x;
        slime.y = slimeData.y;
        if (slimeData.animation) {
          slime.play(slimeData.animation, true);
          slime.flipX = slimeData.flipX;
        }
      });
    });
  }

  update() {
    const inputState = {
      left: this.cursors.left.isDown,
      right: this.cursors.right.isDown,
      up: this.cursors.up.isDown,
      down: this.cursors.down.isDown,
    };

    socket.emit("playerInput", inputState);
  }
}
