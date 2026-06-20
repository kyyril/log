<script lang="ts">
  import { archiveItems } from '../data'
  import ArchiveCard from './ArchiveCard.svelte'

  const anime = archiveItems.filter((item) => item.category === 'anime').slice(0, 3)
  const manga = archiveItems.filter((item) => item.category === 'manga').slice(0, 3)
  const games = archiveItems.filter((item) => item.category === 'games').slice(0, 3)

  const sections = [
    { title: 'ANIME', image: '/section/animeSection.png', items: anime, href: '/anime' },
    { title: 'MANGA', image: '/section/mangaSection.png', items: manga, href: '/manga' },
    { title: 'GAMES', image: '/section/gameSection.png', items: games, href: '/games' },
  ]
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

  <div class="space-y-20">
    {#each sections as section, i}
      <div>
        <div class="relative w-full h-40 md:h-56 mb-8 overflow-hidden rounded-lg">
          <img
            src={section.image}
            alt={section.title}
            class="absolute inset-0 w-full h-full object-contain object-right"
          />
          <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span class="text-5xl md:text-7xl font-black uppercase tracking-wider text-transparent" style="-webkit-text-stroke: 2px black; paint-order: stroke fill;">
              {section.title}
            </span>
          </div>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
          {#each section.items as item (item.id)}
            <ArchiveCard {item} />
          {/each}
        </div>
        <div class="mt-6 text-center">
          <a href={section.href} class="px-4 py-2 border border-foreground text-foreground text-xs font-medium rounded hover:bg-foreground hover:text-white transition-colors">View More</a>
        </div>
      </div>
    {/each}
  </div>
</section>
