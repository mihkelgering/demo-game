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
    game.set({ timeRemaining: 3600, levels: [0] });
    await api.post<GameState>("newLevel", { idLevel: $game.levels[0] });
  }

  async function loadGame() {
    game.set(await api.get<GameState>("loadGame"));
  }

  loadGame();
</script>

<div id="container">
  {#if !$game}
    <div class="credentials">
      <h1>
        <div class="header-content">
          <img src="logo.svg" alt="kood/"/>
          <span id="gameWord">game</span>
        </div>
      </h1>
      <p>Welcome to our humble puzzle game! In this game your goal is to move boxes onto designated targets.</p>
      <p>Move using the arrow keys or the buttons below the game. Reset a level using the circle button or by pressing the R key. Skip a level by pressing the skip button. Skipping is allowed once every 10 minutes.</p>
      <p>You have 1 hour. Good luck!</p>
      <input
        class="credentials-input"
        bind:value={idCode}
        placeholder="Enter national ID code"
      />
      {#if error}
        <p class="error">{error}</p>
      {/if}
      <button class="credentials-button" on:click={() => startGame(idCode)}
        >Start playing</button
      >
    </div>
  {:else if $game.timeRemaining < 1}
    <p>TIME IS OVER</p>
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

  .header-content {
    display: flex;
    align-items: center;
    font-size: 2.8rem;
  }

  p {
    font-size: 1.3rem;
  }

  #gameWord {
    margin-left: 10px;
  }
  .credentials {
    color: grey;
    width: 50%;
  }
  .credentials-button {
    margin-top: 1rem;
    width: 100%;
    height: 3rem;
    border-radius: 20px;
    border-width: 0px;
    background-color: #483628;
    color: white;
    font-size: 1.3rem;
  }

  .credentials-button:hover {
    background-color: #98453d;
    color: white;
    font-size: 1.3rem;
    cursor: pointer;
  }
  .credentials-input {
    text-align: center;
    width: 100%;
    height: 3rem;
    border-radius: 20px;
    border-width: 0px;
  }

  @media only screen and (max-width: 600px) {
    #container {
        height: 120vh;
    }
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

  .error {
    color: red;
    margin: 0;
    margin-top: 5px;
  }
</style>
