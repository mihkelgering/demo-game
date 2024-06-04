<script lang="ts">
    import Game from "./components/Game.svelte";
    import {game} from "./store";
    import Welcome from "./components/Welcome.svelte";
    import End from "./components/End.svelte";
    import type {GameState} from "./types";
    import {GAME_TIME, SKIP_TIME} from "./consts";

    let error = "";

    async function startGame() {
        let newGame = {
            timeRemaining: GAME_TIME,
            levels: [0],
            finished: false,
            skipTime: SKIP_TIME,
        };
        localStorage.setItem("gameState", JSON.stringify(newGame));
        game.set(newGame);
    }

    async function loadGame() {
        let data: GameState = JSON.parse(localStorage.getItem("gameState"));
        if (!data) return;

        game.set(data);
    }

    loadGame();
</script>

<div id="container">
    {#if !$game}
        <Welcome {error} on:startGame={startGame}/>
    {:else if $game.finished}
        <End/>
    {:else}
        <Game level={$game.levels[0]}/>
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
