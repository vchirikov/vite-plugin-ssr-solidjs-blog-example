<script context="module">
  export const hello = 'booooo';
</script>

<script lang="ts">
  import type { Container } from 'inversify';
  import { getContext, onMount } from 'svelte';

  import { Services } from '#lib/container';
  import type { Logger } from '#lib/diagnostics/logging';

  let state_text = 'Pre-rendered (SSG)';

  const container = getContext<Container>('container');

  const logger = container.get<Logger>(Services.Logger);
  const containerType = container.get<string>(Services.ContainerType);

  logger.info('container:', containerType);
  onMount(() => {
    state_text = 'Pre-rendered and interactive (hydrated)';
  });
</script>

<ul>
  <h1>MDX page</h1>
  <li>{state_text}</li>
  <li>container used for rendering: {containerType}</li>
</ul>

<a href="/confetti" class="contrast">Navigate to confetti page (via CSR)</a>
