<script lang="ts">
  import Header from './components/Header.svelte'
  import AboutSection from './components/AboutSection.svelte'
  import ArchiveSection from './components/ArchiveSection.svelte'
  import AnimePage from './pages/AnimePage.svelte'
  import MangaPage from './pages/MangaPage.svelte'
  import GamesPage from './pages/GamesPage.svelte'
  import Footer from './components/Footer.svelte'
  import { afterUpdate } from 'svelte'

  let current = ''
  let ready = false
  let scrolling = false

  const navigate = (page: string) => {
    current = page
    const url = page ? `/${page}` : '/'
    window.history.pushState({}, '', url)
    scrolling = true
  }

  const handleRoute = () => {
    const path = window.location.pathname.replace(/^\//, '')
    if (path === 'anime') current = 'anime'
    else if (path === 'manga') current = 'manga'
    else if (path === 'games') current = 'games'
    else current = ''
  }

  afterUpdate(() => {
    if (scrolling) {
      scrolling = false
      window.scrollTo({ top: 0 })
    }
  })

  if (typeof window !== 'undefined') {
    window.addEventListener('popstate', handleRoute)
    handleRoute()
    ready = true
  }
</script>

{#if ready}
  <main class="min-h-screen flex flex-col bg-background">
    <Header {navigate} />
    {#if current === 'anime'}
      <AnimePage {navigate} />
    {:else if current === 'manga'}
      <MangaPage {navigate} />
    {:else if current === 'games'}
      <GamesPage {navigate} />
    {:else}
      <AboutSection />
      <ArchiveSection {navigate} />
    {/if}
    <Footer {navigate} />
  </main>
{/if}

<style global>
  :global(html) {
    background-color: #faf9f7;
  }
</style>
