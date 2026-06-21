<script lang="ts">
  import { archiveItems } from '../data'
  import ArchiveCard from './ArchiveCard.svelte'
  export let navigate: (page: string) => void = () => {}

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

  <div class="space-y-20">
    {#each sections as section, i}
      <div>
        <div class="relative w-full h-40 md:h-56 mb-8 overflow-hidden rounded-lg">
          <img
            src={section.image}
            alt={section.title}
            class="absolute inset-0 w-full h-full object-contain {section.title === 'ANIME' ? 'object-right' : section.title === 'MANGA' ? 'object-left' : 'object-right'}"
          />
          <div class="absolute inset-0 flex pointer-events-none {section.title === 'ANIME' ? 'justify-end pr-8 pt-0 items-start' : section.title === 'MANGA' ? 'justify-start pl-4 items-end pb-4' : 'justify-end pr-8 items-center'}">
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
          <button type="button" on:click={() => navigate(section.href.slice(1))} class="px-4 py-2 border border-foreground text-foreground text-xs font-medium rounded hover:bg-foreground hover:text-white transition-colors">View More</button>
        </div>
      </div>
    {/each}
  </div>
</section>
