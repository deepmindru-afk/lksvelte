<script lang="ts">
  import { cn } from '$lib/cn';

  let className: string = $state('');
  let agentState: string = $state('connecting');
  let color: string | undefined = $state(undefined);
  let barCount: number | undefined = $state(undefined);
  let size: 'icon' | 'sm' | 'md' | 'lg' | 'xl' = $state('md');
  export { className as class, agentState as state, color, barCount, size };

  const _barCount = $derived(barCount ?? (size === 'icon' || size === 'sm' ? 3 : 5));

  const sizeClasses: Record<string, string> = {
    icon: 'h-[24px] gap-[2px]',
    sm: 'h-[56px] gap-[4px]',
    md: 'h-[112px] gap-[8px]',
    lg: 'h-[224px] gap-[16px]',
    xl: 'h-[448px] gap-[32px]',
  };

  const elSizeClasses: Record<string, string> = {
    icon: 'w-[4px] min-h-[4px]',
    sm: 'w-[8px] min-h-[8px]',
    md: 'w-[16px] min-h-[16px]',
    lg: 'w-[32px] min-h-[32px]',
    xl: 'w-[64px] min-h-[64px]',
  };

  const sequencerInterval = $derived.by(() => {
    switch (state) {
      case 'connecting': return 2000 / _barCount;
      case 'initializing': return 2000;
      case 'listening': return 500;
      case 'thinking': return 150;
      default: return 1000;
    }
  });

  let animIndex = $state(0);
  let sequence: number[][] = $state([[]]);

  $effect(() => {
    if (agentState === 'thinking') {
      sequence = (() => { const c = Math.floor(_barCount / 2); return [[c], [-1]]; })();
    } else if (agentState === 'connecting' || agentState === 'initializing') {
      const seq: number[][] = [];
      for (let x = 0; x < _barCount; x++) seq.push([x, _barCount - 1 - x]);
      sequence = seq;
    } else if (agentState === 'listening') {
      const c = Math.floor(_barCount / 2);
      sequence = [[c], [-1]];
    } else if (agentState === undefined || agentState === 'speaking') {
      sequence = [new Array(_barCount).fill(0).map((_, idx) => idx)];
    } else {
      sequence = [[]];
    }
    animIndex = 0;
  });

  $effect(() => {
    if (agentState === 'speaking') return;
    const id = setInterval(() => { animIndex += 1; }, sequencerInterval);
    return () => clearInterval(id);
  });

  const highlightedIndices = $derived(sequence[animIndex % sequence.length] ?? []);
  const bands = $derived(new Array(_barCount).fill(0));
</script>

<div data-lk-state={agentState} style={color ? `color: ${color}` : ''} class={cn('relative flex items-center justify-center', sizeClasses[size], className)}>
  {#each bands as _, idx}
    <div
      data-lk-index={idx}
      data-lk-highlighted={highlightedIndices.includes(idx)}
      style="height: 0%"
      class={cn('rounded-full transition-colors duration-250 ease-linear bg-current/10 data-[lk-highlighted=true]:bg-current', elSizeClasses[size])}
    ></div>
  {/each}
</div>
