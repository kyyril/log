<script lang="ts">
  import type { ArchiveItem } from '../types'

  export let item: ArchiveItem

  let expanded = false

  const categoryIcons: Record<string, string> = {
    anime: '🎬',
    manga: '📖',
    games: '🎮',
    movies: '🎞️',
  }

  const statusLabels: Record<string, string> = {
    completed: 'Completed',
    'in-progress': 'In Progress',
    dropped: 'Dropped',
    planned: 'Planned',
  }

  const statusColors: Record<string, string> = {
    completed: 'bg-accent text-white',
    'in-progress': 'bg-accent-light text-white',
    dropped: 'bg-gray-300 text-gray-700',
    planned: 'bg-gray-200 text-gray-700',
  }

  const toggleExpanded = () => {
    expanded = !expanded
  }
</script>

<div class="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
  <div class="relative overflow-hidden h-48 bg-gray-200">
    <img
      src={item.imageUrl}
      alt={item.title}
      class="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
      loading="lazy"
    />
    <div class="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
      {categoryIcons[item.category]} {item.category}
    </div>
  </div>

  <div class="p-4">
    <h3 class="text-title-md font-bold text-foreground mb-2 line-clamp-2">
      {item.title}
    </h3>

    <div class="flex items-center justify-between mb-3">
      <span class="text-sm text-text-secondary">{item.year}</span>
      {#if item.rating}
        <div class="flex gap-0.5">
          {#each Array(5) as _, i}
            <span class={i < item.rating ? 'text-yellow-400' : 'text-gray-300'}>★</span>
          {/each}
        </div>
      {/if}
    </div>

    <div class="mb-3">
      <span class={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusColors[item.status]}`}>
        {statusLabels[item.status]}
      </span>
    </div>

    <button
      on:click={toggleExpanded}
      class="w-full py-2 text-sm font-medium text-accent hover:text-accent-light transition-colors flex items-center justify-center gap-2"
    >
      {expanded ? 'Hide' : 'Show'} Details
      <svg
        class="w-4 h-4 transition-transform duration-300 {expanded ? 'rotate-180' : ''}"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    </button>

    {#if expanded}
      <div class="mt-4 pt-4 border-t border-gray-200 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
        <p class="text-body-sm text-text-secondary leading-relaxed">
          {item.note}
        </p>

        <div class="grid grid-cols-2 gap-2 text-body-sm">
          {#if item.hours}
            <div class="flex items-center gap-2 text-text-secondary">
              <span class="font-medium">⏱️</span>
              <span>{item.hours} hours</span>
            </div>
          {/if}
          {#if item.chapters}
            <div class="flex items-center gap-2 text-text-secondary">
              <span class="font-medium">📄</span>
              <span>{item.chapters} chapters</span>
            </div>
          {/if}
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  :global(.line-clamp-2) {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  :global(.animate-in) {
    animation: slideIn 0.3s ease-out;
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
