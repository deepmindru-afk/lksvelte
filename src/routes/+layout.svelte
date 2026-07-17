<script lang="ts">
  import '../app.css';
  import { theme } from '$lib/stores/theme';
  import ThemeToggle from '$lib/components/app/theme-toggle.svelte';

  let { children, data } = $props();

  const pageTitle = data.pageTitle;
  const pageDescription = data.pageDescription;
  const companyName = data.companyName;
  const logo = data.logo;
  const logoDark = data.logoDark;
  const styles = data.styles;
</script>

<svelte:head>
  <title>{pageTitle}</title>
  <meta name="description" content={pageDescription} />
  {#if styles}<style>{styles}</style>{/if}
</svelte:head>

<div class="scroll-smooth font-sans antialiased" class:dark={$theme === 'dark' || ($theme === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches)}>
  <header class="fixed top-0 left-0 z-50 hidden w-full flex-row justify-between p-6 md:flex">
    <a target="_blank" rel="noopener noreferrer" href="https://www.portalos.ru" class="scale-100 transition-transform duration-300 hover:scale-110">
      <img src={logo} alt="{companyName} Logo" class="block size-6 dark:hidden" />
      <img src={logoDark} alt="{companyName} Logo" class="hidden size-6 dark:block" />
    </a>
    <span class="text-foreground font-mono text-xs font-bold tracking-wider uppercase">
      Сделано людьми <a target="_blank" rel="noopener noreferrer" href="https://www.portalos.ru" class="underline underline-offset-4">АО Портал</a>
    </span>
  </header>

  {@render children()}

  <div class="group fixed bottom-0 left-1/2 z-50 mb-2 -translate-x-1/2">
    <div class="translate-y-20 transition-transform delay-150 duration-300 group-hover:translate-y-0">
      <ThemeToggle />
    </div>
  </div>
</div>
