<script lang='ts'>
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher()

    const codeEntered =  (code: string) => {
        dispatch('codeEntered', code)
    }
    export let idCode = "";
    export let error = "";
</script>


<div class="credentials">
    <h1>
      <div class="header-content">
        <img src="logo.svg" alt="kood/"/>
        <span id="gameWord">game</span>
      </div>
    </h1>
    <p>Welcome to our humble puzzle game! In this game your goal is to move boxes onto designated targets.</p>
    <p>Move using the arrow keys or the buttons below the game. Reset a level using the circle button or by pressing the R key. Skip a level by pressing the skip button. Skipping is allowed once every 10 minutes.</p>
    <p>You have one hour. Try to complete as many levels as possible. Good luck!</p>
    <input
      class="credentials-input"
      bind:value={idCode}
      placeholder="Enter national ID code"
    />
    {#if error}
      <p class="error">{error}</p>
    {/if}
    <button class="credentials-button" on:click={() => codeEntered(idCode)}
      >Start playing</button
    >
  </div>

<style>

  :global(body) {
    color: #483628;
    background: #101419;
    overflow-y: scroll;
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
    color: rgb(214, 213, 213);
    width: 50%;
  }
  .credentials-button {
    margin-top: 1rem;
    margin-bottom: 1rem;
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
    font-size: 1.1rem;
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
    color: rgb(255, 84, 84);
    margin: 0;
    margin-top: 8px;
  }


  @media only screen and (max-width: 500px) {
    .credentials {
        margin-top: 90px;
    }

    .credentials-input {
        font-size: 0.9rem;
    }
}

</style>