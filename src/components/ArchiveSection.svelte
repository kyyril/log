<script lang="ts">
  import { archiveItems } from '../data'
  import type { Category } from '../types'
  import ArchiveCard from './ArchiveCard.svelte'

  type FilterOption = 'all' | Category

  let selectedFilter: FilterOption = 'all'

  const categories: { label: string; value: FilterOption; icon: string }[] = [
    { label: 'All', value: 'all', icon: '📚' },
    { label: 'Anime', value: 'anime', icon: '🎬' },
    { label: 'Manga', value: 'manga', icon: '📖' },
    { label: 'Games', value: 'games', icon: '🎮' },
  ]

  $: filteredItems =
    selectedFilter === 'all' ? archiveItems : archiveItems.filter((item) => item.category === selectedFilter)

  $: stats = {
    total: archiveItems.length,
    completed: archiveItems.filter((item) => item.status === 'completed').length,
    inProgress: archiveItems.filter((item) => item.status === 'in-progress').length,
    totalHours: archiveItems.reduce((sum, item) => sum + (item.hours || 0), 0),
  }
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

    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
      <div class="bg-white p-4 rounded-lg shadow-sm">
        <div class="text-2xl font-bold text-accent mb-1">{stats.total}</div>
        <div class="text-sm text-text-secondary">Total Items</div>
      </div>
      <div class="bg-white p-4 rounded-lg shadow-sm">
        <div class="text-2xl font-bold text-accent mb-1">{stats.completed}</div>
        <div class="text-sm text-text-secondary">Completed</div>
      </div>
      <div class="bg-white p-4 rounded-lg shadow-sm">
        <div class="text-2xl font-bold text-accent mb-1">{stats.inProgress}</div>
        <div class="text-sm text-text-secondary">In Progress</div>
      </div>
      <div class="bg-white p-4 rounded-lg shadow-sm">
        <div class="text-2xl font-bold text-accent mb-1">{stats.totalHours}h</div>
        <div class="text-sm text-text-secondary">Hours Watched</div>
      </div>
    </div>

    <div class="flex flex-wrap gap-3 mb-8">
      {#each categories as category}
        <button
          on:click={() => (selectedFilter = category.value)}
          class="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
          class:bg-accent={selectedFilter === category.value}
          class:text-white={selectedFilter === category.value}
          class:bg-gray-200={selectedFilter !== category.value}
          class:text-foreground={selectedFilter !== category.value}
          class:hover:bg-gray-300={selectedFilter !== category.value}
        >
          {category.icon} {category.label}
        </button>
      {/each}
    </div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {#each filteredItems as item (item.id)}
      <div class="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <ArchiveCard {item} />
      </div>
    {/each}
  </div>

  {#if filteredItems.length === 0}
    <div class="text-center py-12">
      <p class="text-body-lg text-text-secondary">No items found in this category.</p>
    </div>
  {/if}
</section>

<style>
  :global(#archive) {
    scroll-margin-top: 80px;
  }

  :global(.animate-in) {
    animation: slideUp 0.5s ease-out;
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(16px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
