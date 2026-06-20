<script lang="ts">
  import type { ArchiveItem } from '../types'

  export let item: ArchiveItem

  let showModal = false
  let imgError = false
  const fallback = 'https://dummyimage.com/skyscraper/f0f/f'
  $: poster = imgError ? fallback : item.imageUrl

  const handleImgError = () => {
    imgError = true
  }
</script>

<button type="button" class="cursor-pointer text-left w-full" on:click={() => (showModal = true)}>
  <div class="aspect-[2/3] rounded-lg overflow-hidden bg-gray-200">
    <img
      src={poster}
      alt={item.title}
      class="w-full h-full object-cover"
      loading="lazy"
      on:error={handleImgError}
    />
  </div>

  <div class="p-3">
    <h3 class="text-sm font-bold text-foreground truncate mb-1.5">
      {item.title}
    </h3>

    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2 text-[11px] text-text-secondary">
        <span>{item.year}</span>
        {#if item.hours}
          <span class="text-gray-300">•</span>
          <span>{item.hours}h</span>
        {:else if item.chapters}
          <span class="text-gray-300">•</span>
          <span>{item.chapters}ch</span>
        {/if}
      </div>

      <div class="flex gap-0.5 text-[11px]">
        {#each Array(5) as _, i}
          <span class={item.rating && i < item.rating ? 'text-yellow-400' : 'text-gray-300'}>★</span>
        {/each}
      </div>
    </div>
  </div>
</button>

{#if showModal}
  <dialog
    open={showModal}
    class="fixed inset-0 z-50 m-auto p-4 bg-transparent backdrop:bg-black/60 backdrop:backdrop-blur-sm max-w-none"
    on:close={() => (showModal = false)}
    on:click|self
  >
    <div class="bg-white rounded-lg overflow-hidden shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col md:flex-row">
      <div class="md:w-5/12 bg-gray-100 flex-shrink-0">
        <img
          src={poster}
          alt={item.title}
          class="w-full h-full object-cover max-h-[40vh] md:max-h-[90vh]"
        />
      </div>

      <div class="p-5 md:p-6 md:w-7/12 overflow-y-auto relative">
        <button
          type="button"
          aria-label="Close"
          class="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
          on:click={() => {
            showModal = false
          }}
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 class="text-2xl font-bold text-foreground mb-2">{item.title}</h2>
        <div class="flex flex-wrap items-center gap-3 mb-3 text-sm text-text-secondary">
          <span>{item.year}</span>
          {#if item.hours}
            <span>• {item.hours}h</span>
          {/if}
          {#if item.chapters}
            <span>• {item.chapters}ch</span>
          {/if}
        </div>

        {#if item.rating}
          <div class="flex gap-0.5 text-yellow-400 mb-4">
            {#each Array(5) as _, i}
              <span class={i < item.rating ? '' : 'text-gray-300'}>★</span>
            {/each}
          </div>
        {/if}

        <p class="text-text-secondary leading-relaxed mb-5">
          {item.note}
        </p>

        <div class="inline-block px-3 py-1 rounded-full text-xs font-medium bg-black/5">
          <span class="text-foreground">{item.status}</span>
        </div>
      </div>
    </div>
  </dialog>
{/if}
