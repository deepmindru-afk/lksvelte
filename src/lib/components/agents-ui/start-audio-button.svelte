<script lang="ts">
  import { cn } from '$lib/cn';

  let className: string = '';
  let label: string = 'Start Audio';
  let disabled: boolean = false;
  export { className as class, label, disabled };
</script>

<button {disabled} class={cn('inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none shrink-0 outline-none bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2', className)} on:click>
  {label}
</button>
