<script>
  // @ts-nocheck

  import { tweened } from "svelte/motion";
  import { game } from "../store";

  let original = $game.timeRemaining ? $game.timeRemaining : 3600; // TYPE NUMBER OF SECONDS HERE
  let timer = tweened(original);
  setInterval(() => {
    if ($timer > 0) {
      $timer--;
      game.update((current) => {
        return { ...current, timeRemaining: $timer };
      });
    }
  }, 1000);

  $: minutes = Math.floor($timer / 60);
  $: seconds = Math.floor($timer - minutes * 60);
</script>

<div>
  {#if timer < 1}
    <p>kek</p>
  {:else}
    <p>Time: {minutes}:{seconds < 10 ? "0" + seconds : seconds}</p>

    <progress value={$timer / 3600} />
  {/if}
</div>
