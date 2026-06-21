<script lang="ts">
  import type { ArchiveItem } from '../types'

  export let item: ArchiveItem

  let imgError = false
  const fallback = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="300" viewBox="0 0 200 300"><rect width="100%" height="100%" fill="%23e5e7eb"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="14" fill="%239ca3af">NO IMAGE</text></svg>'
  $: poster = imgError ? fallback : item.imageUrl

  const handleImgError = () => {
    imgError = true
  }

  const getMalUrl = () => {
    if (item.category === 'games') return null
    const parts = item.id.split('-')
    if (parts.length < 2) return null
    const malId = parts[1]
    return `https://myanimelist.net/${item.category}/${malId}`
  }
  const malUrl = getMalUrl()
</script>

{#if malUrl}
  <a
    href={malUrl}
    target="_blank"
    rel="noopener noreferrer"
    class="block text-left w-full group"
  >
    <div class="aspect-[2/3] rounded-lg overflow-hidden bg-gray-200 transition duration-300 group-hover:shadow-md relative">
      <img
        src={poster}
        alt={item.title}
        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        loading="lazy"
        on:error={handleImgError}
      />
      <div class="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-foreground text-white text-[9px] font-bold px-2 py-0.5 rounded shadow tracking-wider">
        MAL ↗
      </div>
    </div>

    <div class="px-1.5 py-2 sm:p-3">
      <h3 class="text-[11px] sm:text-sm font-bold text-foreground truncate mb-1 transition-colors group-hover:text-foreground/80">
        {item.title}
      </h3>

      <div class="flex items-center justify-between gap-1">
        <div class="flex items-center gap-1 text-[10px] text-text-secondary font-mono">
          <span>{item.year}</span>
          {#if item.hours}
            <span class="text-gray-300">•</span>
            <span>{item.hours}h</span>
          {:else if item.chapters}
            <span class="text-gray-300">•</span>
            <span>{item.chapters}ch</span>
          {/if}
        </div>

        {#if item.category !== 'games' && item.score}
          <div class="text-[10px] font-bold text-yellow-600 bg-yellow-500/10 px-1.5 py-0.5 rounded font-mono flex-shrink-0">
            ★ {item.score}/10
          </div>
        {:else if item.category !== 'games' && item.rating}
          <div class="text-[10px] font-bold text-yellow-600 bg-yellow-500/10 px-1.5 py-0.5 rounded font-mono flex-shrink-0">
            ★ {item.rating * 2}/10
          </div>
        {/if}
      </div>
    </div>
  </a>
{:else}
  <div class="text-left w-full">
    <div class="aspect-[2/3] rounded-lg overflow-hidden bg-gray-200">
      <img
        src={poster}
        alt={item.title}
        class="w-full h-full object-cover"
        loading="lazy"
        on:error={handleImgError}
      />
    </div>

    <div class="px-1.5 py-2 sm:p-3">
      <h3 class="text-[11px] sm:text-sm font-bold text-foreground truncate mb-1">
        {item.title}
      </h3>

      <div class="flex items-center justify-between gap-1">
        <div class="flex items-center gap-1 text-[10px] text-text-secondary font-mono">
          <span>{item.year}</span>
          {#if item.hours}
            <span class="text-gray-300">•</span>
            <span>{item.hours}h</span>
          {:else if item.chapters}
            <span class="text-gray-300">•</span>
            <span>{item.chapters}ch</span>
          {/if}
        </div>

        {#if item.category !== 'games' && item.score}
          <div class="text-[10px] font-bold text-yellow-600 bg-yellow-500/10 px-1.5 py-0.5 rounded font-mono flex-shrink-0">
            ★ {item.score}/10
          </div>
        {:else if item.category !== 'games' && item.rating}
          <div class="text-[10px] font-bold text-yellow-600 bg-yellow-500/10 px-1.5 py-0.5 rounded font-mono flex-shrink-0">
            ★ {item.rating * 2}/10
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}
