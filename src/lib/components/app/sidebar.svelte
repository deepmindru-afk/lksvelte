<script lang="ts">
  import { cn } from '$lib/cn';
  import { Brain, CalendarDays, Clock, History, KeyRound, Link, MessageSquareTextIcon, MoreVertical, Search, Sparkles, Table2, XIcon } from 'lucide-svelte';
  import Input from '$lib/components/ui/input.svelte';
  import Button from '$lib/components/ui/button.svelte';
  import CalendarView from '$lib/components/app/sidebar-calendar.svelte';

  let { open = false, onClose = () => {} }: { open?: boolean; onClose?: () => void } = $props();

  interface Session { id: string; title: string; preview: string; updatedAt: string; }
  interface Model { id: string; name: string; }

  let sessions: Session[] = $state([]);
  let loading: boolean = $state(false);
  let models: Model[] = $state([]);
  let selectedModel: string = $state('');
  let search: string = $state('');
  let apiKey: string = $state('');
  let showApiKey: boolean = $state(false);
  let apiEndpoint: string = $state('');
  let showApiEndpoint: boolean = $state(false);
  let showSampleTable: boolean = $state(false);
  let activeTab: 'chat' | 'calendar' = $state('chat');

  const sampleTableData = [
    { task: 'Implement auth middleware', status: 'Done', priority: 'High', assignee: 'Alice' },
    { task: 'Write API documentation', status: 'In Progress', priority: 'Medium', assignee: 'Bob' },
    { task: 'Fix login redirect bug', status: 'Done', priority: 'High', assignee: 'Alice' },
    { task: 'Design dashboard layout', status: 'Pending', priority: 'Low', assignee: 'Carol' },
    { task: 'Database migration script', status: 'In Progress', priority: 'High', assignee: 'Bob' },
    { task: 'End-to-end tests', status: 'Pending', priority: 'Medium', assignee: 'Carol' },
  ];

  async function fetchModels(key: string, endpoint: string) {
    const baseUrl = endpoint.trim() || 'https://lm.portalos.ru/v1/models';
    if (key.trim()) {
      try {
        const res = await fetch(baseUrl, { headers: { Authorization: `Bearer ${key.trim()}` } });
        if (res.ok) {
          const data = await res.json();
          const list: Model[] = (data.data ?? []).map((m: { id: string }) => ({ id: m.id, name: m.id }));
          models = list;
          if (list.length > 0) selectedModel = list[0].id;
          return;
        }
      } catch {}
    }
    try {
      const res = await fetch('/api/models', { method: 'POST', headers: { 'Content-Type': 'application/json' } });
      const data = await res.json();
      const list: Model[] = data.models ?? [];
      models = list;
      if (list.length > 0) selectedModel = list[0].id;
    } catch {}
  }

  async function loadSessions() {
    loading = true;
    sessions = [];
    try {
      const res = await fetch('/api/sessions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ limit: 20 }) });
      const data = await res.json();
      sessions = data.sessions ?? [];
    } catch {}
    finally { loading = false; }
  }

  $effect(() => { if (open) loadSessions(); });

  function groupSessions(sessionsList: Session[]) {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
    const groups: { label: string; sessions: Session[] }[] = [];
    const todayS: Session[] = [], yesterdayS: Session[] = [], olderS: Session[] = [];
    for (const s of sessionsList) {
      const d = new Date(s.updatedAt); d.setHours(0, 0, 0, 0);
      if (d.getTime() === today.getTime()) todayS.push(s);
      else if (d.getTime() === yesterday.getTime()) yesterdayS.push(s);
      else olderS.push(s);
    }
    if (todayS.length > 0) groups.push({ label: 'Today', sessions: todayS });
    if (yesterdayS.length > 0) groups.push({ label: 'Yesterday', sessions: yesterdayS });
    if (olderS.length > 0) groups.push({ label: 'Older', sessions: olderS });
    return groups;
  }

  const filteredSessions = $derived(
    search ? sessions.filter(s => s.title.toLowerCase().includes(search.toLowerCase()) || s.preview.toLowerCase().includes(search.toLowerCase())) : sessions
  );
  const grouped = $derived(groupSessions(filteredSessions));

  let debounceTimer: ReturnType<typeof setTimeout>;
  function handleApiKeyChange(value: string) {
    apiKey = value;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => fetchModels(value, apiEndpoint), 500);
  }
  function handleEndpointChange(value: string) {
    apiEndpoint = value;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => fetchModels(apiKey, value), 500);
  }
</script>

{#if open}
  <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
  <div class="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onclick={onClose} role="presentation"></div>
  <aside class="fixed top-0 left-0 z-50 flex h-full w-72 flex-col border-r bg-sidebar text-sidebar-foreground border-sidebar-border md:w-80 translate-x-0 transition-transform duration-300">
    <div class="flex items-center gap-1 border-b border-sidebar-border bg-gradient-to-r from-sidebar to-sidebar/95 px-3 py-2">
      <Button variant="ghost" size="sm" onclick={() => activeTab = 'chat'} class={cn('gap-1.5 px-2.5 py-1.5 text-xs font-medium', activeTab === 'chat' ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'text-sidebar-foreground/60 hover:text-sidebar-foreground')}>
        <MessageSquareTextIcon class="size-3.5" /> Chat
      </Button>
      <Button variant="ghost" size="sm" onclick={() => activeTab = 'calendar'} class={cn('gap-1.5 px-2.5 py-1.5 text-xs font-medium', activeTab === 'calendar' ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'text-sidebar-foreground/60 hover:text-sidebar-foreground')}>
        <CalendarDays class="size-3.5" /> Calendar
      </Button>
      <Button variant="ghost" size="icon" onclick={onClose} class="rounded-md p-1.5"><XIcon class="size-4" /></Button>
    </div>

    {#if activeTab === 'calendar'}
      <div class="flex-1 overflow-y-auto p-3"><CalendarView /></div>
    {:else}
      <div class="border-b border-sidebar-border/50 px-4 py-2.5">
        <Button variant="ghost" size="sm" onclick={() => showApiKey = !showApiKey} class="mb-1.5 gap-1.5 px-0 text-[11px] font-semibold tracking-wider text-sidebar-foreground/50 uppercase hover:text-sidebar-foreground/70">
          <KeyRound class="size-3" /> API Key
        </Button>
        {#if showApiKey}
          <Input type="password" value={apiKey} oninput={(e) => handleApiKeyChange(e.currentTarget.value)} placeholder="sk-..." class="border-sidebar-border/30 bg-sidebar-accent/20 py-1.5 px-2.5 text-xs" />
        {/if}
        <Button variant="ghost" size="sm" onclick={() => showApiEndpoint = !showApiEndpoint} class="mt-2 gap-1.5 px-0 text-[11px] font-semibold tracking-wider text-sidebar-foreground/50 uppercase hover:text-sidebar-foreground/70">
          <Link class="size-3" /> API Endpoint
        </Button>
        {#if showApiEndpoint}
          <Input type="text" value={apiEndpoint} oninput={(e) => handleEndpointChange(e.currentTarget.value)} placeholder="https://lm.portalos.ru/v1/models" class="mt-1 border-sidebar-border/30 bg-sidebar-accent/20 py-1.5 px-2.5 text-xs" />
        {/if}
      </div>

      {#if models.length > 0}
        <div class="border-b border-sidebar-border/50 px-4 py-2.5">
          <div class="mb-2 flex items-center gap-1.5 text-[11px] font-semibold tracking-wider text-sidebar-foreground/50 uppercase">
            <Brain class="size-3" /> Model
          </div>
          <select bind:value={selectedModel} class="w-full rounded-md border border-sidebar-border/50 bg-sidebar-accent/30 px-3 py-2 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent/50">
            {#each models as m}
              <option value={m.id}>{m.name}</option>
            {/each}
          </select>
        </div>
      {/if}

      <div class="border-b border-sidebar-border/50 px-4 py-2.5">
        <div class="relative">
          <Search class="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-sidebar-foreground/30" />
          <Input type="text" bind:value={search} placeholder="Search conversations..." class="border-sidebar-border/30 bg-sidebar-accent/20 py-1.5 pr-2.5 pl-8 text-xs placeholder:text-sidebar-foreground/30" />
        </div>
      </div>

      <div class="flex-1 overflow-y-auto p-3">
        {#if showSampleTable}
          <div class="mb-4 overflow-hidden rounded-lg border border-sidebar-border/40">
            <div class="bg-sidebar-accent/30 px-3 py-2 text-[11px] font-semibold tracking-wider text-sidebar-foreground/60 uppercase">Project Tasks</div>
            <div class="overflow-x-auto">
              <table class="w-full text-xs">
                <thead>
                  <tr class="border-b border-sidebar-border/20 bg-sidebar-accent/20">
                    <th class="px-3 py-2 text-left font-semibold text-sidebar-foreground/70">Task</th>
                    <th class="px-3 py-2 text-left font-semibold text-sidebar-foreground/70">Status</th>
                    <th class="px-3 py-2 text-left font-semibold text-sidebar-foreground/70">Priority</th>
                    <th class="px-3 py-2 text-left font-semibold text-sidebar-foreground/70">Assignee</th>
                  </tr>
                </thead>
                <tbody>
                  {#each sampleTableData as row, i}
                    <tr class={cn('border-b border-sidebar-border/10', i % 2 === 0 ? 'bg-sidebar-accent/10' : 'bg-transparent', 'hover:bg-sidebar-accent/20')}>
                      <td class="max-w-[140px] truncate px-3 py-2 font-medium text-sidebar-foreground">{row.task}</td>
                      <td class="px-3 py-2 whitespace-nowrap text-sidebar-foreground/80">{row.status}</td>
                      <td class="px-3 py-2 whitespace-nowrap">
                        <span class={cn('rounded-full px-1.5 py-0.5 text-[10px] font-semibold', row.priority === 'High' && 'bg-destructive/15 text-destructive', row.priority === 'Medium' && 'bg-amber-500/15 text-amber-600 dark:text-amber-400', row.priority === 'Low' && 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400')}>{row.priority}</span>
                      </td>
                      <td class="px-3 py-2 text-sidebar-foreground/60">{row.assignee}</td>
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>
          </div>
        {/if}

        {#if loading}
          <div class="flex flex-col items-center justify-center gap-3 py-20">
            <div class="size-6 animate-spin rounded-full border-2 border-sidebar-border/40 border-t-sidebar-foreground/70"></div>
            <span class="text-[11px] text-sidebar-foreground/40 animate-pulse">Loading conversations...</span>
          </div>
        {:else if filteredSessions.length === 0}
          <div class="flex flex-col items-center justify-center gap-3 py-20">
            <div class="flex size-12 items-center justify-center rounded-full bg-sidebar-accent/50">
              <History class="size-5 text-sidebar-foreground/30" />
            </div>
            <p class="px-4 text-center text-xs text-sidebar-foreground/40 leading-relaxed">{search ? 'No conversations match your search.' : 'No conversations yet.'}</p>
          </div>
        {:else}
          <div class="space-y-4">
            {#each grouped as group}
              <div>
                <div class="mb-1.5 px-1 text-[11px] font-semibold tracking-wider text-sidebar-foreground/40 uppercase">{group.label}</div>
                <div class="space-y-0.5">
                  {#each group.sessions as session}
                    <button class="group w-full rounded-lg p-3 text-left transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground border border-transparent hover:border-sidebar-border/30">
                      <div class="mb-1 flex items-center gap-2">
                        <span class="flex-1 truncate text-sm font-medium">{session.title}</span>
                      </div>
                      <div class="text-sidebar-foreground/45 mb-1.5 line-clamp-2 text-xs leading-relaxed">{session.preview}</div>
                      <div class="flex items-center gap-1.5 text-[10px] text-sidebar-foreground/25">
                        <Clock class="size-2.5" />
                        {new Date(session.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </div>
                    </button>
                  {/each}
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    {/if}
  </aside>
{/if}
