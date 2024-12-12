import { mount } from 'svelte'
import './app.scss'
import App from './App.svelte'
import './api/mock'

const app = mount(App, {
  target: document.getElementById('app')!,
})

export default app
