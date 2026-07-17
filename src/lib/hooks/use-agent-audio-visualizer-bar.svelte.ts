function generateConnectingSequenceBar(columns: number): number[][] {
  const seq = [];
  for (let x = 0; x < columns; x++) {
    seq.push([x, columns - 1 - x]);
  }
  return seq;
}

function generateListeningSequenceBar(columns: number): number[][] {
  const center = Math.floor(columns / 2);
  return [[center], [-1]];
}

export function useAgentAudioVisualizerBarAnimator(
  state: string | undefined,
  columns: number,
  interval: number
): number[] {
  let index = $state(0);
  let sequence: number[][] = $state([[]]);

  $effect(() => {
    if (state === 'thinking') {
      sequence = generateListeningSequenceBar(columns);
    } else if (state === 'connecting' || state === 'initializing') {
      sequence = [...generateConnectingSequenceBar(columns)];
    } else if (state === 'listening') {
      sequence = generateListeningSequenceBar(columns);
    } else if (state === undefined || state === 'speaking') {
      sequence = [new Array(columns).fill(0).map((_, idx) => idx)];
    } else {
      sequence = [[]];
    }
    index = 0;
  });

  $effect(() => {
    if (state === 'speaking') return;
    const id = setInterval(() => { index += 1; }, interval);
    return () => clearInterval(id);
  });

  return sequence[index % sequence.length] ?? [];
}
