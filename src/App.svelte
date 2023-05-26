<script lang="ts">
  import api from "./api/api";
  import Game from "./components/Game.svelte";
  import { type GameResponse, type GameState } from "./types";
  import { game } from "./store";
  let idCode = null;
  let error = "";

  async function startGame(idCode: string) {
    let data: GameResponse = await api.post("newGame", {
      idCode: idCode,
      game: "sokoban",
    });
    if (data.error) {
      error = data.error;
      return;
    }
    $game.set({ timeRemaining: 3600, levels: [0] });
    await api.post<GameState>("newLevel", { idLevel: game.levels[0] });
  }

  async function loadGame() {
    $game = await api.get<GameState>("loadGame");
  }

  loadGame();
</script>

<div>
  {#if !$game}
    <div class="credentials">
      <p>Please enter your personal ID code</p>
      <input
        class="credentials-input"
        bind:value={idCode}
        placeholder="enter your personal ID code"
      />
      {#if error}
        <p>{error}</p>
      {/if}
      <button class="credentials-button" on:click={() => startGame(idCode)}
        >submit</button
      >
    </div>
  {:else}
    <Game level={$game.levels[0]} />
  {/if}
</div>

<style>
  .credentials {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 10px;
  }
  .credentials-button {
  }
  .credentials-input {
    text-align: center;
    width: 25rem;
    height: 3rem;
    border-radius: 20px;
    border-width: 0px;
  }

  ::placeholder {
    text-align: center;
  }

  /* or, for legacy browsers */

  ::-webkit-input-placeholder {
    text-align: center;
  }

  :-moz-placeholder {
    /* Firefox 18- */
    text-align: center;
  }

  ::-moz-placeholder {
    /* Firefox 19+ */
    text-align: center;
  }

  :-ms-input-placeholder {
    text-align: center;
  }
</style>
