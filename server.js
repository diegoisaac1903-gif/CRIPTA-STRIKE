const path = require("node:path");
const express = require("express");
const { GameDig } = require("gamedig");

const app = express();
const webPort = Number(process.env.PORT) || 3000;
const gameHost = process.env.GAME_SERVER_HOST || "147.185.221.215";
const gamePort = Number(process.env.GAME_SERVER_PORT) || 2832;

app.get("/", (_request, response) => {
  response.sendFile(path.join(__dirname, "index.html"));
});

app.use("/assets", express.static(path.join(__dirname, "assets")));

app.get("/api/server-status", async (_request, response) => {
  response.set("Cache-Control", "no-store");

  try {
    const state = await GameDig.query({
      type: "counterstrike16",
      host: gameHost,
      port: gamePort,
      socketTimeout: 2000,
      attemptTimeout: 6000,
    });

    response.json({
      online: true,
      name: state.name || "CRIPTA-STRIKER LBPSJ",
      map: state.map || "Desconocido",
      numplayers: state.numplayers ?? 0,
      maxplayers: state.maxplayers ?? 0,
    });
  } catch (error) {
    console.error("No se pudo consultar el servidor de Counter-Strike:", error);
    response.json({
      online: false,
      name: null,
      map: null,
      numplayers: 0,
      maxplayers: 0,
    });
  }
});

app.listen(webPort, () => {
  console.log(`Web de Cripta Strike disponible en http://localhost:${webPort}`);
});