<script lang="ts">
  import { cn } from '$lib/cn';

  let className: string = $state('');
  export { className as class };

  const today = new Date();
  const currentMonth = $state(today.getMonth());
  const currentYear = $state(today.getFullYear());

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
</script>

<div class={cn('', className)}>
  <div class="text-sm font-semibold mb-3">
    {new Date(currentYear, currentMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
  </div>
  <div class="grid grid-cols-7 gap-1 text-center text-xs mb-1">
    {#each weekdays as day}
      <div class="text-muted-foreground font-medium py-1">{day}</div>
    {/each}
  </div>
  <div class="grid grid-cols-7 gap-1 text-center text-xs">
    {#each Array(firstDayOfWeek) as _}
      <div></div>
    {/each}
    {#each days as day}
      <div class={cn('rounded-full py-1', day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear() ? 'bg-primary text-primary-foreground' : 'hover:bg-accent')}>
        {day}
      </div>
    {/each}
  </div>
</div>
