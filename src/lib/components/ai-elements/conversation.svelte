<script lang="ts">
  import { cn } from '$lib/cn';
  let className: string = '';
  export { className as class };
</script>

<div class={cn('flex flex-col', className)}>
  <slot />
</div>
