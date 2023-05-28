<script lang="ts">
  import { tweened } from "svelte/motion";
  import { game } from "../store";

  let original =  $game.timeRemaining;
  let timer = tweened(original);
  setInterval(() => {
    if ($timer > 0) {
      $timer--;
      game.update((game) => {
        game.timeRemaining = $timer;
        game.skipTime = game.skipTime - 1;
        return game;
      });
    }
  }, 1000);

  $: minutes = Math.floor($timer / 60);
  $: seconds = Math.floor($timer - minutes * 60);
</script>

<div class="timerContainer">
    <p>Time: {minutes}:{seconds < 10 ? "0" + seconds : seconds}</p>
    <progress value={$timer / 3600} />
</div>

<style>

  p {
    margin-bottom: 1rem;
    color: rgb(228, 227, 227);
  }

  .timerContainer {
    font-size: 2.5vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 90%;
    font-weight: bold;
    margin-bottom: 1rem;
    margin-top: 2vh;
  }
  progress {
    width: 100%;
  }
</style>
