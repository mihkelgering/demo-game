<script lang="ts">
  import api from "./api/api";
  import Game from "./components/Game.svelte";
  import { type GameState } from "./store";

  let PLAYER_ID = null;
  let input = null;
  const setPlayerId = (id) => {
    PLAYER_ID = id;
    return id;
  };

  let game: GameState = null;
  let loaded = false;

  async function getGame() {
    game = await api.get<GameState>("loadGame");
    loaded = true;
  }
  //getGame();
</script>

<div>
  {#if !game.userCookie}
    <div class="credentials">
      <p>Please enter your personal ID code</p>
      <input
        class="credentials-input"
        bind:value={input}
        placeholder="enter your personal ID code"
      />
      <button class="credentials-button" on:click={setPlayerId(input)}
        >submit</button
      >
    </div>
  {:else}
    <Game />
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
