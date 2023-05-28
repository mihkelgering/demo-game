<script lang="ts">
  import api from "./api/api";
  import Game from "./components/Game.svelte";
  import { type GameResponse, type GameState } from "./types";
  import { game } from "./store";
  import Welcome from "./components/Welcome.svelte";
  import End from "./components/End.svelte";
  import maps from "./maps";

  let error = "";

  async function startGame(event: CustomEvent<string>) {
    let data: GameResponse = await api.post("newGame", {
      idCode: event.detail,
      game: "sokoban",
    });
    if (data.error) {
      error = data.error;
      return;
    }
    game.set({ timeRemaining: 3600, skipTime: 600, levels: [0] });
    await api.post("newLevel", { idLevel: $game.levels[0] });
  }

  async function loadGame() {
    game.set(await api.get<GameState>("loadGame"));
  }

  loadGame();
</script>

<div id="container">
  {#if !$game}
    <Welcome {error} on:codeEntered={startGame} />
  {:else if $game.timeRemaining < 1 || $game.levels.length > maps.length}
    <End/>
  {:else}
    <Game level={$game.levels[0]} />
  {/if}
</div>

<style>
  #container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100vw;
  }

  :global(body) {
    margin: 0;
    font-family: 'Quicksand', sans-serif;
  }
</style>
