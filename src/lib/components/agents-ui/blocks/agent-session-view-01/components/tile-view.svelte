<script lang="ts">
  import { cn } from '$lib/cn';
  import AudioVisualizer from './audio-visualizer.svelte';

  let {
    chatOpen = false,
    audioVisualizerType,
    audioVisualizerColor,
    audioVisualizerColorShift,
    audioVisualizerBarCount,
  }: {
    chatOpen?: boolean;
    audioVisualizerType?: string;
    audioVisualizerColor?: string;
    audioVisualizerColorShift?: number;
    audioVisualizerBarCount?: number;
  } = $props();
</script>

<div class="relative mx-auto w-full max-w-5xl px-4 md:px-0">
  <div class="flex items-center justify-center min-h-[300px]">
    <AudioVisualizer
      {audioVisualizerType}
      {audioVisualizerColor}
      {audioVisualizerColorShift}
      {audioVisualizerBarCount}
      {chatOpen}
    />
  </div>
</div>
