import svelteLogo from '../assets/windowicons/aim_fldr.ico';
import vsLogo from '../assets/windowicons/vb-bas.ico';
import shmulSys from '../assets/myIcon_1.png';

import AboutMe from '../lib/AboutMe.svelte';

export const paintIcon =
  'https://win98icons.alexmeub.com/icons/png/paint_old-0.png';

export interface DesktopIcon {
  order: number;
  left: number;
  src: string;
}

export interface WindowConfig {
  id: string;
  kind:
    | 'fileSystem'
    | 'jsPaint'
    | 'component'
    | 'vsCode'
    | 'snakeGame'
    | 'content';
  desktop?: DesktopIcon;
  component?: unknown;
  content?: string;
  docName?: string;
  shell?: WindowShellConfig;
}

export interface WindowShellConfig {
  fitMode?: 'contain';
  contentAspectRatio?: number;
  initialScale?: number;
  chromeWidth?: number;
  chromeHeight?: number;
  desktopViewportMargin?: number;
  mobileViewportMargin?: number;
  minWidth?: number;
  minHeight?: number;
}

export const windowRegistry: WindowConfig[] = [
  {
    id: 'File System',
    kind: 'fileSystem',
    desktop: { order: 1, left: 25, src: svelteLogo },
  },
  {
    id: 'Js Paint',
    kind: 'jsPaint',
    desktop: { order: 3, left: 25, src: paintIcon },
  },
  {
    id: 'Overview',
    kind: 'component',
    component: AboutMe,
    desktop: { order: 0, left: 30, src: shmulSys },
  },
  {
    id: 'VS Code',
    kind: 'vsCode',
    content: 'codemirror',
    desktop: { order: 2, left: 25, src: vsLogo },
  },
  {
    id: 'resume',
    kind: 'vsCode',
    content: 'resume',
    shell: {
      fitMode: 'contain',
      contentAspectRatio: 1232 / 1602,
      initialScale: 0.75,
      chromeWidth: 31,
      chromeHeight: 48,
      desktopViewportMargin: 48,
      mobileViewportMargin: 16,
      minWidth: 360,
      minHeight: 305,
    },
  },
  { id: 'snake', kind: 'snakeGame' },
  { id: 'My_Philosophy', kind: 'content', docName: 'My_Philosophy' },
  { id: 'hobbies', kind: 'content', docName: 'Hobbies' },
  { id: 'goals', kind: 'content', docName: 'Goals' },
  { id: 'ideas', kind: 'content', docName: 'Ideas' },
  { id: 'About_Website', kind: 'content', docName: 'About_Website' },
];

export const icons = windowRegistry
  .filter((w) => w.desktop)
  .sort((a, b) => a.desktop!.order - b.desktop!.order)
  .map((w) => ({ left: w.desktop!.left, src: w.desktop!.src, text: w.id }));

export const contentWindowSet = new Set(
  windowRegistry.filter((w) => w.kind === 'content').map((w) => w.id)
);

export const vsCodeShellWindowSet = new Set(
  windowRegistry
    .filter((w) => w.kind === 'vsCode' || w.kind === 'content')
    .map((w) => w.id)
);

export function isContentWindow(name: string): boolean {
  return contentWindowSet.has(name);
}

export function needsVsCode(name: string): boolean {
  return vsCodeShellWindowSet.has(name);
}
