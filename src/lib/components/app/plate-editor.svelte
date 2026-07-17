<script lang="ts">
  import { onMount } from 'svelte';

  let editorEl: HTMLDivElement;
  let editor: any = null;

  onMount(async () => {
    const { Editor } = await import('@tiptap/core');
    const { default: StarterKit } = await import('@tiptap/starter-kit');
    const { default: Underline } = await import('@tiptap/extension-underline');
    const { default: Highlight } = await import('@tiptap/extension-highlight');

    editor = new Editor({
      element: editorEl,
      extensions: [StarterKit, Underline, Highlight],
      content: '<p>Start typing...</p>',
    });
  });

  $effect(() => {
    return () => { editor?.destroy(); };
  });
</script>

<div class="w-full">
  <div class="border rounded-lg p-3 min-h-[200px] prose prose-sm max-w-none" bind:this={editorEl}></div>
</div>
