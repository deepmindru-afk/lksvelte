<script lang="ts">
  import { cn } from '$lib/cn';
  import { Menu, Table2 } from 'lucide-svelte';
  import type { AppConfig } from '$lib/app-config';
  import ViewController from '$lib/components/app/view-controller.svelte';
  import Sidebar from '$lib/components/app/sidebar.svelte';
  import RightSidebar from '$lib/components/app/right-sidebar.svelte';
  import Button from '$lib/components/ui/button.svelte';
  import { Toaster } from 'svelte-sonner';

  let {
    appConfig,
    username = '',
    roomName = '',
    onUsernameChange = (v: string) => {},
    onRoomNameChange = (v: string) => {},
  }: {
    appConfig: AppConfig;
    username?: string;
    roomName?: string;
    onUsernameChange?: (v: string) => void;
    onRoomNameChange?: (v: string) => void;
  } = $props();

  let sidebarOpen = $state(false);
  let rightSidebarOpen = $state(false);
  let connected = $state(false);

  function onConnectedChange(v: boolean) { connected = v; }
</script>

<main class="grid h-svh grid-cols-1 place-content-center">
  <ViewController {appConfig} bind:username bind:roomName />
</main>

{#if connected}
  <Button variant="ghost" size="icon" onclick={() => sidebarOpen = true} class="fixed left-3 top-3 z-50 md:left-6 md:top-6" aria-label="Open sidebar">
    <Menu class="size-5" />
  </Button>
  <Button variant="ghost" size="icon" onclick={() => rightSidebarOpen = true} class="fixed right-3 top-3 z-50 md:right-6 md:top-6" aria-label="Open right sidebar">
    <Table2 class="size-5" />
  </Button>
{/if}

<Sidebar open={sidebarOpen} onClose={() => sidebarOpen = false} />
<RightSidebar open={rightSidebarOpen} onClose={() => rightSidebarOpen = false} />

<Toaster position="top-center" />
