import { writable } from 'svelte/store';

type Theme = 'dark' | 'light' | 'system';

function getStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';
  const stored = localStorage.getItem('theme') as Theme | null;
  return stored ?? 'dark';
}

function getSystemTheme(): 'dark' | 'light' {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme: Theme) {
  const resolved = theme === 'system' ? getSystemTheme() : theme;
  document.documentElement.classList.toggle('dark', resolved === 'dark');
}

export const theme = writable<Theme>(getStoredTheme());

theme.subscribe((value) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('theme', value);
    applyTheme(value);
  }
});

if (typeof window !== 'undefined') {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', () => {
    theme.update((t) => {
      if (t === 'system') applyTheme('system');
      return t;
    });
  });
}

export function getResolvedTheme(): 'dark' | 'light' {
  let current: Theme = 'dark';
  theme.subscribe((v) => { current = v; })();
  return current === 'system' ? getSystemTheme() : current;
}
