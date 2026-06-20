<script lang="ts">
  import type { ArchiveItem } from '../types'

  export let item: ArchiveItem
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
      {item.category}
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
      <span class="inline-block px-3 py-1 rounded-full text-xs font-medium">
        {item.status}
      </span>
    </div>

    <div class="mt-4 pt-4 border-t border-gray-200 space-y-3">
      {#if item.note}
        <p class="text-body-sm text-text-secondary leading-relaxed">
          {item.note}
        </p>
      {/if}

      <div class="grid grid-cols-2 gap-2 text-body-sm">
        {#if item.hours}
          <div class="flex items-center gap-2 text-text-secondary">
            <span class="font-medium">Hours</span>
            <span>{item.hours} hours</span>
          </div>
        {/if}
        {#if item.chapters}
          <div class="flex items-center gap-2 text-text-secondary">
            <span class="font-medium">Chapters</span>
            <span>{item.chapters} chapters</span>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>

<style>
  :global(.line-clamp-2) {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>
