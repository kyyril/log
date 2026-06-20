<script lang="ts">
  import Header from './components/Header.svelte'
  import AboutSection from './components/AboutSection.svelte'
  import ArchiveSection from './components/ArchiveSection.svelte'
  import AnimePage from './pages/AnimePage.svelte'
  import MangaPage from './pages/MangaPage.svelte'
  import GamesPage from './pages/GamesPage.svelte'

  let current = ''

  const navigate = (page: string) => {
    current = page
    window.location.hash = page
  }

  const handleHash = () => {
    const hash = window.location.hash.replace('#', '')
    current = hash
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('hashchange', handleHash)
    handleHash()
  }
</script>

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
</main>

<style global>
  :global(html) {
    background-color: #faf9f7;
  }
</style>
