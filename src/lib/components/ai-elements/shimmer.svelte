<script lang="ts">
  import { cn } from '$lib/cn';
  let className: string = '';
  export { className as class };
</script>

<div class={cn('animate-pulse rounded bg-muted', className)}>
  <slot />
</div>
