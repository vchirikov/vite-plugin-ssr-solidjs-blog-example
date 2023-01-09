<script lang="ts">
  // eslint-disable-next-line no-undef
  const onClick = () => window['confetti']();
</script>

<h1>Confetti</h1>

<svelte:head>
  <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>
</svelte:head>

<a href="/">go back</a>

<!-- svelte-ignore missing-declaration -->
<button on:click={onClick}> Fire confetti </button>
