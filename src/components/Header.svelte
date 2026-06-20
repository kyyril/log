<script lang="ts">
  export let current = ''
  export let navigate: (page: string) => void

  let menuOpen = false

  const toggleMenu = () => {
    menuOpen = !menuOpen
  }
</script>

<header class="sticky top-0 z-50 bg-white">
  <div class="px-2.5 sm:px-8 lg:px-12 py-2 flex items-center justify-between">
    <div class="flex items-center">
      <button type="button" on:click={() => navigate('')} class="flex items-center hover:opacity-80 transition-opacity">
  <img src="/logo.png" alt="Log 傑作" class="h-12 w-auto" />
  <div class="flex flex-col leading-none -ml-1 mt-2">
    <span class="text-2xl font-extrabold text-foreground">Log</span>
    <span class="text-[10px] ml-1 font-bold text-foreground -mt-0.5">けっさく</span>
        </div>
      </button>
    </div>

    <nav class="hidden md:flex items-center gap-10 text-sm">
      <button type="button" on:click={() => navigate('anime')} class="text-foreground hover:text-foreground transition-colors">Anime</button>
      <button type="button" on:click={() => navigate('manga')} class="text-foreground hover:text-foreground transition-colors">Manga</button>
      <button type="button" on:click={() => navigate('games')} class="text-foreground hover:text-foreground transition-colors">Games</button>
    </nav>

    <button
      on:click={toggleMenu}
      class="md:hidden rounded-lg hover:bg-gray-100 transition-colors"
      aria-label="Toggle menu"
    >
      <svg
        class="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    </button>
  </div>

  {#if menuOpen}
    <nav class="md:hidden bg-white border-t border-gray-200 px-4 py-4 flex flex-col gap-4 text-sm">
      <button type="button" on:click={() => { navigate('anime'); menuOpen = false }} class="text-foreground hover:text-foreground transition-colors text-left">Anime</button>
      <button type="button" on:click={() => { navigate('manga'); menuOpen = false }} class="text-foreground hover:text-foreground transition-colors text-left">Manga</button>
      <button type="button" on:click={() => { navigate('games'); menuOpen = false }} class="text-foreground hover:text-foreground transition-colors text-left">Games</button>
    </nav>
  {/if}
</header>

<style>
  :global(html) {
    scroll-behavior: smooth;
  }
</style>
