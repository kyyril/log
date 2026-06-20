<script lang="ts">
  let menuOpen = false

  const toggleMenu = () => {
    menuOpen = !menuOpen
  }
</script>

<header class="bg-white border-b border-gray-200 sticky top-0 z-50">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
    <div class="flex items-center gap-3">
      <div class="text-2xl font-bold text-foreground">EA</div>
      <div class="text-sm font-medium text-foreground">Entertainment Archive</div>
    </div>

    <nav class="hidden md:flex items-center gap-8 text-sm">
      <a href="#home" class="text-foreground hover:text-foreground transition-colors">Home</a>
      <a href="#about" class="text-foreground hover:text-foreground transition-colors">About</a>
      <a href="#archive" class="text-foreground hover:text-foreground transition-colors">Archive</a>
      <a href="#contact" class="text-foreground hover:text-foreground transition-colors">Contact</a>
    </nav>

    <button
      on:click={toggleMenu}
      class="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
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
      <a href="#home" class="text-foreground hover:text-foreground transition-colors" on:click={() => menuOpen = false}>Home</a>
      <a href="#about" class="text-foreground hover:text-foreground transition-colors" on:click={() => menuOpen = false}>About</a>
      <a href="#archive" class="text-foreground hover:text-foreground transition-colors" on:click={() => menuOpen = false}>Archive</a>
      <a href="#contact" class="text-foreground hover:text-foreground transition-colors" on:click={() => menuOpen = false}>Contact</a>
    </nav>
  {/if}
</header>

<style>
  :global(html) {
    scroll-behavior: smooth;
  }
</style>
