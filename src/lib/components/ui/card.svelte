<script lang="ts">
  import { cn } from '$lib/cn';
  let className: string = '';
  export { className as class };
</script>

<div class={cn('rounded-xl border bg-card text-card-foreground shadow', className)}>
  <slot />
</div>
