<script lang="ts">
  import { onMount } from "svelte";
  import type { ArchiveItem } from "../types";

  export let item: ArchiveItem;

  let imgError = false;
  const fallback =
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="300" viewBox="0 0 200 300"><rect width="100%" height="100%" fill="%23e5e7eb"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="14" fill="%239ca3af">NO IMAGE</text></svg>';

  let dynamicImageUrl = item.imageUrl;
  $: poster = imgError ? fallback : dynamicImageUrl;

  // Reset dynamicImageUrl if item changes
  $: {
    dynamicImageUrl = item.imageUrl;
  }

  const handleImgError = () => {
    imgError = true;
  };

  const getMalUrl = () => {
    if (item.category === "games") return null;
    const parts = item.id.split("-");
    if (parts.length < 2) return null;
    const malId = parts[1];
    return `https://myanimelist.net/${item.category}/${malId}`;
  };
  const malUrl = getMalUrl();

  onMount(async () => {
    // If it's a game and it doesn't have a Backloggd cover yet (indicated by rawg.io background in imageUrl)
    if (
      item.category === "games" &&
      item.imageUrl &&
      item.imageUrl.includes("rawg.io")
    ) {
      const COVER_CACHE_KEY = "rawg_cover_cache";
      const cached = localStorage.getItem(COVER_CACHE_KEY);
      const cache = cached ? JSON.parse(cached) : {};

      // Double check cache first
      if (cache[item.title]) {
        dynamicImageUrl = cache[item.title];
      } else {
        // Sanitize search title
        const cleanTitle = item.title
          .replace(/['"’“”‘:—\-–]/g, " ")
          .replace(/\s+/g, " ")
          .trim();

        const url = `/api/backloggd?page=1&query=${encodeURIComponent(cleanTitle)}&type=games`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1200); // generous 1.2s timeout for individual lazy load

        try {
          const res = await fetch(url, { signal: controller.signal });
          clearTimeout(timeoutId);
          if (res.ok) {
            const html = await res.text();
            const match = html.match(
              /<img\s+class="card-img height"\s+src="([^"]+)"/i,
            );
            const coverUrl = match?.[1] ?? null;
            if (coverUrl) {
              dynamicImageUrl = coverUrl;
              cache[item.title] = coverUrl;
              localStorage.setItem(COVER_CACHE_KEY, JSON.stringify(cache));
            }
          }
        } catch {
          clearTimeout(timeoutId);
        }
      }
    }
  });
</script>

{#if malUrl}
  <!-- Anime / Manga Card linked to MAL -->
  <a
    href={malUrl}
    target="_blank"
    rel="noopener noreferrer"
    class="block text-left w-full group"
  >
    <div
      class="aspect-[2/3] rounded-lg overflow-hidden bg-gray-200 transition duration-300 relative"
    >
      <img
        src={poster}
        alt={item.title}
        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        loading="lazy"
        on:error={handleImgError}
      />
      <div
        class="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-foreground text-white text-[9px] font-bold px-2 py-0.5 rounded tracking-wider"
      >
        MAL ↗
      </div>
    </div>

    <div class="px-1.5 py-2 sm:p-3">
      <h3
        class="text-[11px] sm:text-sm font-bold text-foreground truncate mb-1 transition-colors group-hover:text-foreground/80"
      >
        {item.title}
      </h3>

      <div class="flex items-center justify-between gap-1">
        <div
          class="flex items-center gap-1 text-[10px] text-text-secondary font-mono"
        >
          <span>{item.year}</span>
          {#if item.hours}
            <span class="text-gray-300">•</span>
            <span>{item.hours}h</span>
          {:else if item.chapters}
            <span class="text-gray-300">•</span>
            <span>{item.chapters}ch</span>
          {/if}
        </div>

        {#if item.score}
          <div
            class="text-[10px] font-bold px-1.5 py-0.5 rounded font-mono flex-shrink-0"
          >
            {item.score}/10
          </div>
        {/if}
      </div>
    </div>
  </a>
{:else if item.category === "games" && item.slug}
  <!-- Games Card linked to RAWG -->
  <a
    href="https://rawg.io/games/{item.slug}"
    target="_blank"
    rel="noopener noreferrer"
    class="block text-left w-full group"
  >
    <div
      class="aspect-[2/3] rounded-lg overflow-hidden bg-gray-200 transition duration-300 relative"
    >
      <img
        src={poster}
        alt={item.title}
        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        loading="lazy"
        on:error={handleImgError}
      />
      <div
        class="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-foreground text-white text-[9px] font-bold px-2 py-0.5 rounded tracking-wider"
      >
        RAWG ↗
      </div>
    </div>

    <div class="px-1.5 py-2 sm:p-3">
      <h3
        class="text-[11px] sm:text-sm font-bold text-foreground truncate mb-0.5 transition-colors group-hover:text-foreground/80"
      >
        {item.title}
      </h3>

      {#if item.platforms && item.platforms.length > 0}
        <div class="text-[9px] text-text-secondary/70 truncate mb-1">
          {item.platforms.slice(0, 3).join(" • ")}
        </div>
      {/if}

      <div class="flex items-center justify-between gap-1 mt-1">
        <span class="text-[10px] text-text-secondary font-mono"
          >{item.year}</span
        >
        {#if item.genres && item.genres.length > 0}
          <span
            class="text-[9px] text-text-secondary/70 bg-gray-100 px-1.5 py-0.5 rounded truncate max-w-[70%] text-right"
            >{item.genres[0]}</span
          >
        {/if}
      </div>

      {#if item.tags && item.tags.length > 0}
        <div class="flex flex-wrap gap-1 mt-1.5">
          {#each item.tags.slice(0, 2) as tag}
            <span
              class="text-[8px] text-text-secondary/60 bg-gray-50 border border-gray-200 px-1 py-0.5 rounded leading-none"
              >{tag}</span
            >
          {/each}
        </div>
      {/if}
    </div>
  </a>
{:else}
  <!-- Fallback static representation -->
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
      <h3
        class="text-[11px] sm:text-sm font-bold text-foreground truncate mb-1"
      >
        {item.title}
      </h3>

      <div class="flex items-center justify-between gap-1">
        <div
          class="flex items-center gap-1 text-[10px] text-text-secondary font-mono"
        >
          <span>{item.year}</span>
          {#if item.hours}
            <span class="text-gray-300">•</span>
            <span>{item.hours}h</span>
          {/if}
        </div>
      </div>
    </div>
  </div>
{/if}
