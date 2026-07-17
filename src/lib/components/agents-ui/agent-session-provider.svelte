<script lang="ts">
  import { setContext } from 'svelte';

  export let session: any = undefined;

  const ctx = $state({ session });
  setContext('session', ctx);
</script>

<slot />
