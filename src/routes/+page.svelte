<script lang="ts">
  import { onMount } from 'svelte';
  import App from '$lib/components/app/app.svelte';
  import { APP_CONFIG_DEFAULTS } from '$lib/app-config';
  import type { AppConfig } from '$lib/app-config';

  let appConfig = $state<AppConfig>(APP_CONFIG_DEFAULTS);
  let username = $state('');
  let roomName = $state('');

  onMount(() => {
    const params = new URLSearchParams(window.location.search);
    username = params.get('username') || '';
    roomName = params.get('room') || '';

    const fallbackUser = params.get('user') ?? '';
    if (fallbackUser) username = fallbackUser;
  });
</script>

<App {appConfig} bind:username bind:roomName />
