<script lang="ts">
  import api from "./api/api";
  import Game from "./components/Game.svelte";
  import {type GameState } from "./types";
  import { game } from "./store";
  import Welcome from "./components/Welcome.svelte";
  import End from "./components/End.svelte";

  let error = "";

  async function startGame(event: CustomEvent<string>) {
    let data: Game | {error: string} = await api.post("newGame", {
      idCode: event.detail,
      game: "sokoban",
    });
    if (data.error) {
      error = data.error;
      return;
    }
    data = data as Game;
    localStorage.setItem("koodGame", data.idToken)
    game.set({
      timeRemaining: 3600,
      levels: [0],
      finished: false,
    });
    await api.post("newLevel", { idLevel: $game.levels[0] });
  }

  async function loadGame() {
    let data = await api.get<GameState>("loadGame");
    game.set(data);
  }

  loadGame();
</script>

<div id="container">
  {#if !$game}
    <Welcome {error} on:codeEntered={startGame} />
  {:else if $game.finished}
    <End />
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
    font-family: "Quicksand", sans-serif;
    overflow: hidden;
    color: #483628;
    background: #101419;
  }

  @media only screen and (max-width: 900px) {
    :global(body) {
      overflow: auto;
    }

    #container {
      height: auto;
    }
  }

  * {
    touch-action: manipulation;
  }


</style>
