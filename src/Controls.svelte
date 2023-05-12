<script lang='ts'>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher()

  const move =  (key: string) => {
    dispatch('move', {key})
  }

  const reset = () => {
    dispatch('reset')
  }

  function onkeydown(event) {
        // `keydown` event is fired while the physical key is held down.

        // Assuming you only want to handle the first press, we early
        // return to skip.
        if (event.repeat) return;
        console.log(event.key)
        // In the switch-case we're updating our boolean flags whenever the
        // desired bound keys are pressed.
        switch(event.key) {
          case "ArrowUp":
            move("up");
            break;
          case "ArrowDown":
            move("down");
            break;
          case "ArrowLeft":
            move("left");
            break;
          case "ArrowRight":
            move("right");
            break;
          case "r":
            //TODO
            break;
        }     
    }


</script>
<svelte:window
    on:keydown={onkeydown}
/>
 
<div>
 <button
   style:grid-area="up"
   on:click={() => {
     move("up");
   }}
 >
   <svg viewBox="-5 -5 10 10">
     <g fill="none" stroke="#411001" stroke-width="1">
       <path transform="rotate(0)" d="M 0 -4 l 3 3 v 5 h -6 v -5z" />
     </g>
   </svg>
 </button>
 <button
   style:grid-area="right"
   on:click={() => {
     move("right");
   }}
 >
   <svg viewBox="-5 -5 10 10">
     <g fill="none" stroke="#411001" stroke-width="1">
       <path transform="rotate(90)" d="M 0 -4 l 3 3 v 5 h -6 v -5z" />
     </g>
   </svg>
 </button>
 <button
   style:grid-area="down"
   on:click={() => {
     move("down");
   }}
 >
   <svg viewBox="-5 -5 10 10">
     <g fill="none" stroke="#411001" stroke-width="1">
       <path transform="rotate(180)" d="M 0 -4 l 3 3 v 5 h -6 v -5z" />
     </g>
   </svg>
 </button>
 <button
   style:grid-area="left"
   on:click={() => {
     move("left");
   }}
 >
   <svg viewBox="-5 -5 10 10">
     <g fill="none" stroke="#411001" stroke-width="1">
       <path transform="rotate(270)" d="M 0 -4 l 3 3 v 5 h -6 v -5z" />
     </g>
   </svg>
 </button>
 <button style:grid-area="reset" on:click={reset}>
   <svg viewBox="-5 -5 10 10">
     <g fill="none" stroke="#411001" stroke-width="1">
       <circle r="4" />
     </g>
   </svg>
 </button>
</div>

<style>
 div {
    display: grid;
    grid-template-columns: repeat(3, auto);
    grid-template-areas: ". up ." "left reset right" ". down .";
    grid-auto-rows: auto;
    gap: 0.25rem;
    justify-content: center;
    justify-items: center;
  }

  button {
    margin: 0;
    padding: 0;
    display: block;
    padding: 0.5rem;
    background: #feb16b;
    border: 0.18rem solid #411001;
    max-width: 3rem;
  }

  svg {
    display: block;
    width: 100%;
    height: auto;
  }
</style>