import './app.css';
import 'svelte-drag-drop-touch';

// @ts-expect-error
import App from './App.svelte';

import { mount } from 'svelte';

const app = mount(App, {
  target: document.getElementById('app'),
});

export default app;
