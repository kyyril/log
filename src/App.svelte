<script>
  import Header from './components/Header.svelte'
  import HeroBanner from './components/HeroBanner.svelte'
  import AboutSection from './components/AboutSection.svelte'
  import ArchiveSection from './components/ArchiveSection.svelte'
</script>

<main class="min-h-screen flex flex-col bg-background">
  <Header />
  <HeroBanner />
  <AboutSection />
  <ArchiveSection />
</main>

<style global>
  :global(html) {
    background-color: #faf9f7;
  }
</style>
