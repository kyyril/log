<script lang="ts">
  import { onMount } from 'svelte'

  let images = [
    'https://images.unsplash.com/photo-1506701881511-8b94a40b0d43?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1491841573634-28fb1dae6419?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1568051243600-549c745b67f9?w=400&h=300&fit=crop',
  ]

  let currentImageIndex = 0

  onMount(() => {
    const interval = setInterval(() => {
      currentImageIndex = (currentImageIndex + 1) % images.length
    }, 5000)

    return () => clearInterval(interval)
  })
</script>

<section id="home" class="relative w-full h-64 md:h-80 overflow-hidden">
  <div class="absolute inset-0">
    {#each images as image, index}
      <img
        src={image}
        alt="Archive showcase {index + 1}"
        class="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
        style="opacity: {index === currentImageIndex ? 1 : 0}"
        loading={index === 0 ? 'eager' : 'lazy'}
      />
    {/each}
  </div>

  <div class="absolute inset-0 bg-black/20"></div>

  <div class="absolute inset-0 flex items-center justify-center">
    <div class="text-center text-white">
      <h1 class="text-title-xl font-bold mb-4 text-balance">
        My Entertainment Archive
      </h1>
      <p class="text-body-lg opacity-90">
        A curated collection of movies, anime, manga, and games
      </p>
    </div>
  </div>

  <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
    {#each images as _, index}
      <button
        class="w-2 h-2 rounded-full transition-all {index === currentImageIndex ? 'bg-white' : 'bg-white/40'}"
        on:click={() => (currentImageIndex = index)}
        aria-label="Go to image {index + 1}"
      />
    {/each}
  </div>
</section>

<style>
  :global(section) {
    scroll-margin-top: 80px;
  }
</style>
