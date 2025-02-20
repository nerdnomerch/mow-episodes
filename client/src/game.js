import Phaser from "phaser";
import { config } from "./config/gameConfig";
import { createCharacterSelect } from "./ui/createCharacterSelect";

async function startGame() {
  await createCharacterSelect();
  new Phaser.Game(config);
}

startGame();
