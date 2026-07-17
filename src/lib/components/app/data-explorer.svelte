<script lang="ts">
  import { cn } from '$lib/cn';
  import Input from '$lib/components/ui/input.svelte';
  import Button from '$lib/components/ui/button.svelte';
  import { Search, ChevronLeft, ChevronRight } from 'lucide-svelte';

  let className: string = $state('');
  export { className as class };

  let tables: string[] = $state([]);
  let selectedTable: string = $state('');
  let search: string = $state('');
  let page: number = $state(1);
  let pageSize: number = $state(10);
  let columns: string[] = $state([]);
  let rows: Array<Record<string, unknown>> = $state([]);
  let total: number = $state(0);
  let loading: boolean = $state(false);
  let sortCol: string = $state('');
  let sortDir: 'asc' | 'desc' = $state('asc');

  async function loadTables() {
    try {
      const res = await fetch('/api/data/explore');
      const data = await res.json();
      if (data.tables) tables = data.tables;
    } catch {}
  }

  async function loadData() {
    if (!selectedTable) return;
    loading = true;
    try {
      const params = new URLSearchParams({ table: selectedTable, page: String(page), pageSize: String(pageSize) });
      if (search) params.set('search', search);
      if (sortCol) { params.set('sort', sortCol); params.set('sortDir', sortDir); }
      const res = await fetch(`/api/data/explore?${params}`);
      const data = await res.json();
      columns = data.columns ?? [];
      rows = data.rows ?? [];
      total = data.total ?? 0;
    } catch {}
    finally { loading = false; }
  }

  import { onMount } from 'svelte';

  onMount(loadTables);

  $effect(() => {
    if (selectedTable) loadData();
  });

  function handleSearch() { page = 1; loadData(); }

  function handleSort(col: string) {
    if (sortCol === col) { sortDir = sortDir === 'asc' ? 'desc' : 'asc'; }
    else { sortCol = col; sortDir = 'asc'; }
  }

  const totalPages = $derived(Math.ceil(total / pageSize));
</script>

<div class={cn('', className)}>
  <div class="mb-3">
    <select bind:value={selectedTable} class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
      <option value="">Select table...</option>
      {#each tables as t}
        <option value={t}>{t}</option>
      {/each}
    </select>
  </div>

  <div class="relative mb-3">
    <Input type="text" bind:value={search} placeholder="Search..." oninput={handleSearch} class="pl-8" />
    <Search class="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/50 pointer-events-none" />
  </div>

  {#if loading}
    <div class="flex items-center justify-center py-10">
      <div class="size-6 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-muted-foreground"></div>
    </div>
  {:else if columns.length > 0}
    <div class="overflow-x-auto rounded-lg border">
      <table class="w-full text-xs">
        <thead>
          <tr class="border-b bg-muted/20">
            {#each columns as col}
              <th class="px-3 py-2 text-left font-semibold text-muted-foreground cursor-pointer hover:text-foreground" onclick={() => handleSort(col)}>
                {col} {sortCol === col ? (sortDir === 'asc' ? '↑' : '↓') : ''}
              </th>
            {/each}
          </tr>
        </thead>
        <tbody>
          {#each rows as row}
            <tr class="border-b last:border-0 hover:bg-muted/20">
              {#each columns as col}
                <td class="px-3 py-2 whitespace-nowrap">{String(row[col] ?? '')}</td>
              {/each}
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    <div class="flex items-center justify-between mt-3 text-xs text-muted-foreground">
      <span>{total} records</span>
      <div class="flex items-center gap-2">
        <Button size="icon-xs" variant="ghost" disabled={page <= 1} onclick={() => { page--; loadData(); }}>
          <ChevronLeft class="size-3" />
        </Button>
        <span>{page} / {totalPages}</span>
        <Button size="icon-xs" variant="ghost" disabled={page >= totalPages} onclick={() => { page++; loadData(); }}>
          <ChevronRight class="size-3" />
        </Button>
      </div>
    </div>
  {:else if selectedTable}
    <div class="flex items-center justify-center py-10 text-xs text-muted-foreground">No data</div>
  {/if}
</div>
