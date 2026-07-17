<script lang="ts">
  import { cn } from '$lib/cn';
  import { CalendarDays, FileText, LayoutDashboard, MessageSquareTextIcon, XIcon } from 'lucide-svelte';
  import Button from '$lib/components/ui/button.svelte';
  import CalendarView from '$lib/components/app/sidebar-calendar.svelte';
  import DataExplorer from '$lib/components/app/data-explorer.svelte';
  import PlateEditor from '$lib/components/app/plate-editor.svelte';

  let { open = false, onClose = () => {} }: { open?: boolean; onClose?: () => void } = $props();

  let activeTab: 'chat' | 'calendar' | 'dashboard' | 'editor' = $state('chat');

  const DASHBOARD_URL = typeof window !== 'undefined' ? (window as any).__env?.PUBLIC_DASHBOARD_URL || 'https://portalos.ru' : 'https://portalos.ru';
</script>

{#if open}
  <aside class="fixed inset-0 z-50 flex h-svh w-full flex-col bg-sidebar text-sidebar-foreground">
    <div class="flex items-center gap-1 border-b border-sidebar-border bg-gradient-to-r from-sidebar to-sidebar/95 px-3 py-2">
      <Button variant="ghost" size="sm" onclick={() => activeTab = 'chat'} class={cn('gap-1.5 px-2.5 py-1.5 text-xs font-medium', activeTab === 'chat' ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'text-sidebar-foreground/60 hover:text-sidebar-foreground')}>
        <MessageSquareTextIcon class="size-3.5" /> Samples
      </Button>
      <Button variant="ghost" size="sm" onclick={() => activeTab = 'calendar'} class={cn('gap-1.5 px-2.5 py-1.5 text-xs font-medium', activeTab === 'calendar' ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'text-sidebar-foreground/60 hover:text-sidebar-foreground')}>
        <CalendarDays class="size-3.5" /> Calendar
      </Button>
      <Button variant="ghost" size="sm" onclick={() => activeTab = 'dashboard'} class={cn('gap-1.5 px-2.5 py-1.5 text-xs font-medium', activeTab === 'dashboard' ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'text-sidebar-foreground/60 hover:text-sidebar-foreground')}>
        <LayoutDashboard class="size-3.5" /> Dashboard
      </Button>
      <Button variant="ghost" size="sm" onclick={() => activeTab = 'editor'} class={cn('gap-1.5 px-2.5 py-1.5 text-xs font-medium', activeTab === 'editor' ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'text-sidebar-foreground/60 hover:text-sidebar-foreground')}>
        <FileText class="size-3.5" /> Editor
      </Button>
      <Button variant="ghost" size="icon" onclick={onClose} class="rounded-md p-1.5"><XIcon class="size-4" /></Button>
    </div>

    {#if activeTab === 'calendar'}
      <div class="flex-1 overflow-y-auto p-3"><CalendarView /></div>
    {:else if activeTab === 'dashboard'}
      <iframe src={DASHBOARD_URL} class="flex-1 w-full border-0" title="Dashboard"></iframe>
    {:else if activeTab === 'editor'}
      <div class="flex-1 overflow-y-auto p-3"><PlateEditor /></div>
    {:else}
      <div class="flex-1 overflow-y-auto p-3"><DataExplorer /></div>
    {/if}
  </aside>
{/if}
