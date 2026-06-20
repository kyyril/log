<script lang="ts">
  export let navigate: (page: string) => void = () => {}
</script>

<footer id="contact" class="bg-white mt-16 md:mt-24">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
      <div>
        <h3 class="font-bold text-foreground mb-4">About</h3>
        <p class="text-sm text-text-secondary leading-relaxed">
          A personal collection documenting my journey through entertainment and media.
        </p>
      </div>

      <div>
      <h3 class="font-bold text-foreground mb-4">Categories</h3>
      <ul class="text-sm text-text-secondary space-y-2">
        <li><button type="button" on:click={() => navigate('anime')} class="hover:text-foreground transition-colors">Anime</button></li>
        <li><button type="button" on:click={() => navigate('manga')} class="hover:text-foreground transition-colors">Manga</button></li>
        <li><button type="button" on:click={() => navigate('games')} class="hover:text-foreground transition-colors">Games</button></li>
      </ul>
      </div>

      <div>
        <h3 class="font-bold text-foreground mb-4">Resources</h3>
        <ul class="text-sm text-text-secondary space-y-2">
          <li><a href="https://myanimelist.net" target="_blank" rel="noopener noreferrer" class="hover:text-foreground transition-colors">https://myanimelist.net</a></li>
          <li><a href="https://rawg.io" target="_blank" rel="noopener noreferrer" class="hover:text-foreground transition-colors">https://rawg.io</a></li>
        </ul>
      </div>

      <div>
        <img src="/footerImage.png" alt="Footer" class="w-full h-auto" />
      </div>
    </div>

    <div class="text-center text-xs text-text-secondary">
      <p>&copy; 2026 Log 傑作. All rights reserved.</p>
    </div>
  </div>
</footer>

<style>
  :global(#contact) {
    scroll-margin-top: 80px;
  }

  :global(.animate-in) {
    animation: fadeIn 0.3s ease-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
</style>
