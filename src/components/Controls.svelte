<script lang='ts'>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher()

  const move =  (key: string) => {
    dispatch('move', {key})
  }

  const reset = () => {
    dispatch('reset')
  }
  
  // TODO: Throttle events
  function onkeydown(event) {
        if (event.key == 'ArrowUp' || event.key == 'w') {
          move("up");
        }
        else if (event.key == 'ArrowDown' || event.key == 's') {
          move("down");
        }
        else if (event.key == 'ArrowLeft' || event.key == 'a') {
          move("left");
        }
        else if (event.key == 'ArrowRight' || event.key == 'd') {
          move("right");
        }
        else if (event.key == 'r') {
          reset();
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
    padding-top: 5px;
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
    background: #C7D100;
    border: 0.18rem solid #411001;
    max-width: 3rem;
  }

  svg {
    display: block;
    width: 100%;
    height: auto;
  }
</style>