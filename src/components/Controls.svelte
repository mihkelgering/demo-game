<script lang='ts'>
    import {createEventDispatcher} from 'svelte';
    import {game} from "../store";

    export let disableButtons = false;

    const dispatch = createEventDispatcher()

    const move = (key: string) => {
        dispatch('move', {key})
    }

    const reset = () => {
        dispatch('reset')
    }

    const skip = () => {
        dispatch('skip')
    }

    const undo = () => {
        dispatch('undo')
    }

    let skipTime: number;

    $: {
        skipTime = $game.skipTime;
    }


    // TODO: Throttle events
    function onkeydown(event) {
        if (disableButtons) return;
        if (event.key == 'ArrowUp' || event.key == 'w') {
            move("up");
        } else if (event.key == 'ArrowDown' || event.key == 's') {
            move("down");
        } else if (event.key == 'ArrowLeft' || event.key == 'a') {
            move("left");
        } else if (event.key == 'ArrowRight' || event.key == 'd') {
            move("right");
        } else if (event.key == 'r') {
            reset();
        } else if (event.key == 'u') {
            undo();
        } else if (event.key == 'n') {
            skip();
        }
    }

    function resetGame() {
        localStorage.removeItem("gameState");
        game.set(null);
        location.reload();
    }


</script>
<svelte:window
        on:keydown={onkeydown}
/>

{#if skipTime < 1}
    <button class="skip" on:click={skip}>Skip</button>

{/if}
<div class="resetDiv">
    <button class="resetButton" on:click={resetGame}>
        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-refresh-dot" width="50" height="50"
             viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
             stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4"/>
            <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4"/>
            <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"/>
        </svg>
    </button>
</div>
<div class='controls'>
    <div class='moveButtons'>
        <button
                style:grid-area="up"
                on:click={() => {
      move("up");
    }}
                disabled={disableButtons}
        >
            <svg viewBox="-5 -5 10 10">
                <g fill="none" stroke="#483628" stroke-width="1">
                    <path transform="rotate(0)" d="M 0 -4 l 3 3 v 5 h -6 v -5z"/>
                </g>
            </svg>
        </button>
        <button
                style:grid-area="right"
                on:click={() => {
      move("right");
    }}
                disabled={disableButtons}
        >
            <svg viewBox="-5 -5 10 10">
                <g fill="none" stroke="#483628" stroke-width="1">
                    <path transform="rotate(90)" d="M 0 -4 l 3 3 v 5 h -6 v -5z"/>
                </g>
            </svg>
        </button>
        <button
                style:grid-area="down"
                on:click={() => {
      move("down");
    }}
                disabled={disableButtons}
        >
            <svg viewBox="-5 -5 10 10">
                <g fill="none" stroke="#483628" stroke-width="1">
                    <path transform="rotate(180)" d="M 0 -4 l 3 3 v 5 h -6 v -5z"/>
                </g>
            </svg>
        </button>
        <button
                style:grid-area="left"
                on:click={() => {
      move("left");
    }}
                disabled={disableButtons}
        >
            <svg viewBox="-5 -5 10 10">
                <g fill="none" stroke="#483628" stroke-width="1">
                    <path transform="rotate(270)" d="M 0 -4 l 3 3 v 5 h -6 v -5z"/>
                </g>
            </svg>
        </button>
    </div>
    <div class='extraButtons'>
        <button class="extraButton" disabled={disableButtons} on:click={undo}>Undo</button>
        <button class="extraButton" disabled={disableButtons} on:click={reset}>Reset</button>
    </div>
</div>

<style>

    .moveButtons {
        display: grid;
        padding-top: 5px;
        margin-top: 1rem;
        grid-template-columns: repeat(3, auto);
        grid-template-areas: ". up ." "left . right" ". down .";
        grid-auto-rows: auto;
        gap: 0.25rem;
        justify-content: center;
        justify-items: center;
        width: 30%;
    }

    button {
        margin: 0;
        padding: 0;
        display: block;
        padding: 0.5rem;
        background: #C7D100;
        border: 0.18rem solid #483628;
        width: 3vw;
        cursor: pointer
    }

    @media only screen and (max-width: 700px) {
        button {
            width: 14vw;
        }
    }

    @media screen and (min-width: 700px) and (max-width: 900px) {
        /* your CSS rules here */
        button {
            width: 7vw;
        }
    }

    svg {
        display: block;
        width: 100%;
        height: auto;
    }

    .extraButtons {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 30%;
    }

    .extraButton {
        margin-top: 1rem;
        margin-bottom: 1rem;
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        border: none;
        width: 30%;
        min-width: 100px;
        color: white;
        background-color: #483628;
        font-size: 1.5vh;
        font-weight: bold;
        cursor: pointer;

    }

    .extraButton:hover {
        background-color: #5e4c3c;
    }

    .skip {
        margin-top: 1rem;
        margin-bottom: 1rem;
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        border: none;
        width: 100px;
        color: white;
        background-color: #483628;
        font-size: 1.5vh;
        font-weight: bold;
        cursor: pointer;
        position: absolute;
        left: 10px;
        top: 0;
    }

    .resetButton:hover {
        background-color: #483628;
        color: #ffffff;
    }

    .resetButton {
        margin-top: 1rem;
        margin-bottom: 1rem;
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        border: none;
        min-width: 50px;
        color: #101419;
        background-color: #101419;
        font-size: 1.5vh;
        font-weight: bold;
        cursor: pointer;
        position: absolute;
        right: 10px;
        top: 0;
    }

    .controls {
        display: flex;
        width: 100%;
        justify-content: center;
        align-items: center;
    }

    @media only screen and (max-width: 900px) {
        .controls {
            flex-direction: column;
        }

        .extraButtons {
            margin-top: 30px;
        }
    }

</style>