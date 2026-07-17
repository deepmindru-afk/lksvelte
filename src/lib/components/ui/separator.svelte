<script lang="ts">
  import { cn } from '$lib/cn';
  let className: string = '';
  let orientation: 'horizontal' | 'vertical' = 'horizontal';
  export { className as class, orientation };
</script>

<hr class={cn('shrink-0 bg-border', orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px', className)} />
