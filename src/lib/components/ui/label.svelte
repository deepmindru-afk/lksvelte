<script lang="ts">
  import { cn } from '$lib/cn';
  let className: string = '';
  export { className as class };
</script>

<label class={cn('text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50', className)}>
  <slot />
</label>
