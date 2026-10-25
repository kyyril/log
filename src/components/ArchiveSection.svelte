<script lang="ts">
  import { itemsStore, loadingAnimeStore, loadingMangaStore, loadingGamesStore } from '../lib/store'
  import ArchiveCard from './ArchiveCard.svelte'
  import ArchiveCardSkeleton from './ArchiveCardSkeleton.svelte'
  import { reveal } from '../lib/reveal'
  export let navigate: (page: string) => void = () => {}

  $: anime = $itemsStore.filter((item) => item.category === 'anime').slice(0, 8)
  $: manga = $itemsStore.filter((item) => item.category === 'manga' || item.category === 'novel').slice(0, 8)
  $: games = $itemsStore.filter((item) => item.category === 'games').slice(0, 8)

  $: sections = [
    { title: 'ANIME', image: '/section/animeSection.png', items: anime, href: '/anime', loading: $loadingAnimeStore },
    { title: 'MANGA/NOVEL', image: '/section/mangaSection.png', items: manga, href: '/manga', special: true, loading: $loadingMangaStore },
    { title: 'GAMES', image: '/section/gameSection.png', items: games, href: '/games', loading: $loadingGamesStore },
  ]
</script>

<section id="archive" class="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">

  <div class="space-y-20">
    {#each sections as section, i}
      <div use:reveal={{ delay: i * 80 }}>
        <div class="relative w-full h-40 md:h-56 mb-8 overflow-hidden rounded-lg">
          <img
            src={section.image}
            alt={section.title}
            class="absolute inset-0 w-full h-full object-contain {section.title === 'ANIME' ? 'object-right' : section.special ? 'object-left' : 'object-right'}"
          />
          <div class="absolute inset-0 flex pointer-events-none {section.title === 'ANIME' ? 'justify-end pr-8 pt-0 items-start' : section.special ? 'justify-start pl-4 items-end pb-4' : 'justify-end pr-8 items-center'}">
            {#if section.special}
              <!-- Unique MANGA / NOVEL title -->
              <span class="flex items-end gap-1 -rotate-2">
                <span class="text-4xl md:text-6xl font-black uppercase tracking-tight text-transparent" style="-webkit-text-stroke: 2px black; paint-order: stroke fill;">Manga</span>
                <span class="text-5xl md:text-7xl font-black text-foreground leading-none translate-y-1 select-none" style="text-shadow: 3px 3px 0 #cbd5e1;">/</span>
                <span class="text-4xl md:text-6xl font-black uppercase tracking-tight text-foreground" style="background: linear-gradient(180deg, #111 0%, #444 100%); -webkit-background-clip: text; background-clip: text; color: transparent; transform: skewX(-8deg); display: inline-block;">Novel</span>
              </span>
            {:else}
              <span class="text-5xl md:text-7xl font-black uppercase tracking-wider text-transparent" style="-webkit-text-stroke: 2px black; paint-order: stroke fill;">
                {section.title}
              </span>
            {/if}
          </div>
        </div>

        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {#if section.loading && section.items.length === 0}
            {#each Array(8) as _, j}
              <div class={j >= 4 ? 'hidden lg:block' : ''}>
                <ArchiveCardSkeleton />
              </div>
            {/each}
          {:else}
            {#each section.items as item, j (item.id)}
              <div use:reveal={{ delay: j * 70 }} class={j >= 4 ? 'hidden lg:block' : ''}>
                <ArchiveCard {item} />
              </div>
            {/each}
          {/if}
        </div>

        <div class="mt-6 text-center">
          <button type="button" on:click={() => navigate(section.href.slice(1))} class="px-4 py-2 text-foreground text-xs font-medium underline hover:text-foreground/50 transition-colors">View More</button>
        </div>
      </div>
    {/each}
  </div>
</section>
