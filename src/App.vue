<template>
  <div class="app-container font-inter antialiased text-black">
    <nav class="fixed top-0 left-0 w-full p-6 grid grid-cols-1 gap-4 content-between z-20 top-nav">
      <div class="grid grid-cols-2 justify-items-center">
        <h1 class="text-md cursor-pointer justify-self-start" @click="goToHome()"><b>pol valverde i valverde</b> <br>
          creative technologist & technical producer</h1>
        <router-link to="/about" class="justify-self-end">About / CV</router-link>
      </div>
    </nav>
    <div class="w-full h-full router-view-container px-6 py-36 md:py-24 static">
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" :key="$route.path" />
        </transition>
      </router-view>
    </div>
    <nav class="fixed bottom-0 left-0 w-full p-6 grid grid-cols-1 gap-4 content-between z-20 bottom-nav">
      <div class="grid md:grid-cols-3 grid-cols-2 justify-items-center">
      <a href="mailto:hola@polvalverde.com" target="blank"
        class="underline hover:font-semibold justify-self-start row-span-2 align-middle content-center">hola@polvalverde.com</a>
      <a href="https://www.linkedin.com/in/polvalverde/" target="blank"
        class="underline hover:font-semibold justify-self-end md:justify-self-auto">Linkedin</a>
      <a href="https://www.instagram.com/polvalverde_" target="blank"
        class="underline hover:font-semibold justify-self-end">Instagram</a>
      </div>
    </nav>
  </div>
</template>

<script>
export default {
  methods: {
    goToHome() {
      this.$router.push('/');
    }
  }
}
</script>

<style>
#app {
  font-family: "Inter", serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: black;
  background-color: white;
}

body {
  margin: 0;
  padding: 0;
  /* remove overflow: hidden */
}

.app-container {
  position: relative;
  z-index: 1;
  min-height: 100vh;
}

nav {
  position: relative;
  background-color: white;
}

nav a {
  color: black;
}

nav a.router-link-exact-active {
  font-weight: 700;
}

.router-view-container {
  height: calc(100vh - 12rem);
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: 6rem 1.5rem;
  position: relative;
  background-color: white;
}

.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}

.nav-animation {
  opacity: 1;
  filter: none;
}

/* Remove all nav animation related styles */
.top-nav, .bottom-nav {
  animation-delay: 0s;
}

:root {
  --nav-animation-state: running;
}
</style>
