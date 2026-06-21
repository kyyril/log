<script lang="ts">
  import { itemsStore } from '../lib/store'
  import ArchiveCard from '../components/ArchiveCard.svelte'
  export let navigate: (page: string) => void = () => {}

  $: items = $itemsStore.filter((item) => item.category === 'games')
  const title = 'GAMES'
</script>

<section class="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
  <div class="relative w-full h-40 md:h-56 mb-8 overflow-hidden rounded-lg">
    <img src="/section/gameSection2.png" alt="Games Section" class="absolute inset-0 w-full h-full object-contain object-right" />
    <div class="absolute inset-0 flex items-end pointer-events-none justify-end pr-8">
      <span class="text-5xl md:text-7xl font-black uppercase tracking-wider text-transparent" style="-webkit-text-stroke: 2px black; paint-order: stroke fill;">{title}</span>
    </div>
  </div>

  <button type="button" on:click={() => navigate('')} class="text-xs text-text-secondary hover:text-foreground transition mb-4">← Back</button>

  <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {#each items as item (item.id)}
      <ArchiveCard {item} />
    {/each}
  </div>
</section>
