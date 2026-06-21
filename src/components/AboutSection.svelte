<script lang="ts">
  import { isLoadingStore, errorStore } from "../lib/store";
</script>

<section
  id="about"
  class="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto"
>
  <div class="mb-12">
    <h2 class="text-title-lg md:text-title-xl font-bold text-foreground mb-8">
      <span
        class="text-transparent bg-clip-text"
        style="background-image: linear-gradient(to bottom, transparent 0%, transparent 50%, currentColor 50%, currentColor 100%);"
      >
        ABOUT
      </span>
    </h2>

    <div class="max-w-2xl">
      <p class="text-body-lg text-text-secondary mb-6 leading-relaxed">
        Welcome to my personal entertainment archive. This collection represents
        years of consuming and enjoying various forms of media – from animated
        films and series to manga, anime, and interactive games.
      </p>
      <p class="text-body-lg text-text-secondary mb-6 leading-relaxed">
        Each entry in this archive is carefully documented with notes about my
        experience, rating, and the time I spent with it. This is a living
        project, constantly growing as I discover and experience new
        entertainment.
      </p>
      <p class="text-body-lg text-text-secondary mb-6 leading-relaxed">
        Below you'll find my complete collection organized by category, with
        personal insights and recommendations for each title.
      </p>

      <div
        class="mt-6 flex items-center gap-2 text-xs text-text-secondary font-mono"
      >
        {#if $isLoadingStore}
          <span
            class="inline-block w-2.5 h-2.5 rounded-full bg-yellow-500 animate-pulse"
          ></span>
          <span>Syncing with MyAnimeList...</span>
        {:else if $errorStore}
          <span class="inline-block w-2.5 h-2.5 rounded-full bg-red-500"></span>
          <span
            >Failed to sync: {$errorStore} (using fallback offline data)</span
          >
        {/if}
      </div>
    </div>
  </div>
</section>

<style>
  :global(#about) {
    scroll-margin-top: 80px;
  }
</style>
