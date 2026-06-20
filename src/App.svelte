<script lang="ts">
  import Header from './components/Header.svelte'
  import AboutSection from './components/AboutSection.svelte'
  import ArchiveSection from './components/ArchiveSection.svelte'
  import AnimePage from './pages/AnimePage.svelte'
  import MangaPage from './pages/MangaPage.svelte'
  import GamesPage from './pages/GamesPage.svelte'
  import Footer from './components/Footer.svelte'

  let current = ''
  let ready = false

  const navigate = (page: string) => {
    current = page
    const url = page ? `/${page}` : '/'
    window.history.pushState({}, '', url)
    window.scrollTo({ top: 0 })
  }

  const handleRoute = () => {
    const path = window.location.pathname.replace(/^\//, '')
    if (path === 'anime') current = 'anime'
    else if (path === 'manga') current = 'manga'
    else if (path === 'games') current = 'games'
    else current = ''
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('popstate', handleRoute)
    handleRoute()
    ready = true
  }
</script>

{#if ready}
  <main class="min-h-screen flex flex-col bg-background">
    <Header {navigate} {current} />
    {#if current === 'anime'}
      <AnimePage {navigate} />
    {:else if current === 'manga'}
      <MangaPage {navigate} />
    {:else if current === 'games'}
      <GamesPage {navigate} />
    {:else}
      <AboutSection />
      <ArchiveSection />
    {/if}
    <Footer {navigate} />
  </main>
{/if}

<style global>
  :global(html) {
    background-color: #faf9f7;
  }
</style>
