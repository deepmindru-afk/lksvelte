<script lang="ts">
  import { cn } from '$lib/cn';
  let className: string = '';
  export { className as class };
</script>

<div class="relative w-full overflow-auto" data-slot="table-container">
  <table data-slot="table" class={cn('w-full caption-bottom text-sm', className)}>
    <slot />
  </table>
</div>
