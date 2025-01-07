<template>
  <div class="home-container">
    <div class="main">
      <section class="pb-10">
        <h2 class="pb-4 sticky top-0 z-10" 
            :class="{'appear-animation': true, 'exit-animation': isExiting}"
            :style="getDelayStyle(0, isExiting)">---> Featured</h2>
        <div class="project-grid grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-4">
          <ProjectGridElement
            v-for="(project, index) in featuredProjects"
            :key="project.id"
            :class="{'appear-animation': true, 'exit-animation': isExiting}"
            :style="getDelayStyle(index + 1, isExiting)"
            :imageSrc="project.coverImage"
            :projectName="project.title"
            :projectYear="project.year"
            :projectPlace="project.location"
            :routeName="project.routeName"
          />
        </div>
      </section>
      <section class="pb-10">
        <h2 class="pb-4 sticky top-0 z-10 pt-4" 
            :class="{'appear-animation': true, 'exit-animation': isExiting}"
            :style="getDelayStyle(featuredProjects.length + 1, isExiting)">---> Works</h2>
        <div class="project-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <ProjectGridElement
            v-for="(project, index) in worksProjects"
            :key="project.id"
            :class="{'appear-animation': true, 'exit-animation': isExiting}"
            :style="getDelayStyle(index + featuredProjects.length + 2, isExiting)"
            :imageSrc="project.coverImage"
            :projectName="project.title"
            :projectYear="project.year"
            :projectPlace="project.location"
            :routeName="project.routeName"
          />
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import projects from '@/assets/projects.json';
import ProjectGridElement from '@/components/ProjectGridElement.vue';

export default {
  components: {
    ProjectGridElement
  },
  data() {
    return {
      projects,
      isAnimating: true,
      isExiting: false
    };
  },
  computed: {
    featuredProjects() {
      return this.projects.filter(p => p.type === 'on_going');
    },
    worksProjects() {
      return this.projects.filter(p => p.type === 'featured');
    }
  },
  methods: {
    getDelayStyle(index, isExiting = false) {
      if (isExiting) {
        return { 
          animationDelay: '0s',
          animationName: 'disappear'
        };
      }
      const increment = 0.1;
      return { 
        animationDelay: `${index * increment}s`,
        animationName: 'appear'
      };
    }
  }
}
</script>

<style>
.appear-animation {
  opacity: 0;
  filter: blur(5px);
  animation: appear 0.7s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  will-change: opacity, filter;
}

.exit-animation {
  animation: disappear 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards !important;
  will-change: opacity, filter, transform;
  position: relative;
  z-index: 1;
}

@keyframes appear {
  0% {
    opacity: 0;
    filter: blur(5px);
  }
  100% {
    opacity: 1;
    filter: blur(0);
  }
}

@keyframes disappear {
  0% {
    opacity: 1;
    filter: blur(0);
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    filter: blur(5px);
    transform: translateY(-10px);
  }
}

.home-container {
  width: 100%;
  height: 100%;
}
</style>