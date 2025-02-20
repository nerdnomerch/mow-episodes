const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const GameState = require("./game");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const gameState = new GameState();

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;

io.on("connection", (socket) => {
  const startX = Math.random() * GAME_WIDTH;
  const startY = Math.random() * GAME_HEIGHT;

  socket.on("playerData", (playerData) => {
    gameState.addPlayer(socket.id, {
      x: startX,
      y: startY,
      name: playerData.name,
      spriteId: playerData.spriteId,
    });

    // Emit updated game state to all clients
    io.emit("gameState", {
      players: Array.from(gameState.players.entries()).map(([id, player]) => ({
        id,
        ...player,
      })),
      slimes: gameState.slimes,
    });
  });

  socket.on("playerInput", (inputState) => {
    gameState.update(socket.id, inputState);
    io.emit("gameState", {
      players: Array.from(gameState.players.entries()).map(([id, player]) => ({
        id,
        ...player,
      })),
      slimes: gameState.slimes,
    });
  });

  socket.on("disconnect", () => {
    console.log("Player disconnected:", socket.id);
    gameState.removePlayer(socket.id);
    io.emit("gameState", {
      players: Array.from(gameState.players.entries()).map(([id, player]) => ({
        id,
        ...player,
      })),
      slimes: gameState.slimes,
    });
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
