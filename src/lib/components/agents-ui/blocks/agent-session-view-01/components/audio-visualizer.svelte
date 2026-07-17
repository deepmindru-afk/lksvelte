<script lang="ts">
  import { cn } from '$lib/cn';
  import AgentAudioVisualizerBar from '$lib/components/agents-ui/agent-audio-visualizer-bar.svelte';

  let {
    audioVisualizerType = 'bar',
    audioVisualizerColor,
    audioVisualizerColorShift = 0.3,
    audioVisualizerBarCount = 5,
    isChatOpen = false,
    className = '',
  }: {
    audioVisualizerType?: string;
    audioVisualizerColor?: string;
    audioVisualizerColorShift?: number;
    audioVisualizerBarCount?: number;
    isChatOpen?: boolean;
    className?: string;
  } = $props();
</script>

<div class={cn('flex items-center justify-center', className)}>
  <AgentAudioVisualizerBar
    size={audioVisualizerBarCount <= 5 ? 'xl' : 'lg'}
    state="speaking"
    color={audioVisualizerColor}
    barCount={audioVisualizerBarCount}
    class={cn(audioVisualizerBarCount <= 5 ? 'size-[300px] md:size-[450px]' : 'size-[350px] md:size-[450px]')}
  />
</div>
