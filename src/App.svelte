<script lang="ts">
  import Game from "./components/Game.svelte";

  let PLAYER_ID = null;
  let input = null;
  const setPlayerId = (id) => {
    PLAYER_ID = id;
    return id;
  };
</script>

<div>
  {#if !PLAYER_ID}
    <div class="credentials">
      <p>Enter your personal id</p>
      <input bind:value={input} placeholder="enter your name" />
      <button on:click={setPlayerId(input)}>submit</button>
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
</style>
