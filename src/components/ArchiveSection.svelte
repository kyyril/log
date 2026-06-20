<script lang="ts">
  import { archiveItems } from '../data'
  import ArchiveCard from './ArchiveCard.svelte'

  const anime = archiveItems.filter((item) => item.category === 'anime').slice(0, 3)
  const manga = archiveItems.filter((item) => item.category === 'manga').slice(0, 3)
  const games = archiveItems.filter((item) => item.category === 'games').slice(0, 3)
</script>

<section id="archive" class="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
  <div class="mb-12">
    <h2 class="text-title-lg md:text-title-xl font-bold text-foreground mb-8">
      <span
        class="text-transparent bg-clip-text"
        style="background-image: linear-gradient(to bottom, transparent 0%, transparent 50%, currentColor 50%, currentColor 100%);"
      >
        OUR COLLECTION
      </span>
    </h2>
  </div>

  <div class="space-y-16">
    <div>
      <div class="flex items-end justify-between mb-6">
        <h3 class="text-lg font-bold text-foreground">Anime</h3>
        <a href="#anime" class="px-4 py-2 border border-foreground text-foreground text-xs font-medium rounded hover:bg-foreground hover:text-white transition-colors">View More</a>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
        {#each anime as item (item.id)}
          <ArchiveCard {item} />
        {/each}
      </div>
    </div>

    <div>
      <div class="flex items-end justify-between mb-6">
        <h3 class="text-lg font-bold text-foreground">Manga</h3>
        <a href="#manga" class="px-4 py-2 border border-foreground text-foreground text-xs font-medium rounded hover:bg-foreground hover:text-white transition-colors">View More</a>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
        {#each manga as item (item.id)}
          <ArchiveCard {item} />
        {/each}
      </div>
    </div>

    <div>
      <div class="flex items-end justify-between mb-6">
        <h3 class="text-lg font-bold text-foreground">Games</h3>
        <a href="#games" class="px-4 py-2 border border-foreground text-foreground text-xs font-medium rounded hover:bg-foreground hover:text-white transition-colors">View More</a>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
        {#each games as item (item.id)}
          <ArchiveCard {item} />
        {/each}
      </div>
    </div>
  </div>
</section>
