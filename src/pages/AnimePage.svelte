<script lang="ts">
  import { archiveItems } from '../data'
  import ArchiveCard from '../components/ArchiveCard.svelte'
  export let navigate: (page: string) => void = () => {}
  const items = archiveItems.filter((item) => item.category === 'anime')
</script>

<section class="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
  <button type="button" on:click={() => navigate('')} class="text-xs text-text-secondary hover:text-foreground transition mb-4">← Back to Home</button>
  <h2 class="text-title-lg md:text-title-xl font-bold text-foreground mb-8">Anime</h2>
  <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {#each items as item (item.id)}
      <ArchiveCard {item} />
    {/each}
  </div>
</section>
