<script lang="ts">
  let count: number = 0;
  const increment = () => {
    count += 1;
  };
</script>

<button class="btn btn-lg btn-primary bg-red-500" on:click={increment}>
  count is {count}
</button>
