<template>
    <div class="project-grid-element flex flex-col items-center appear-animation cursor-pointer" @click="handleClick">
        <div class="image-wrapper relative w-full pt-[62.5%]">
            <img :src="imageSrc.url" :alt="imageSrc.alt" class="project-image absolute top-0 left-0 w-full h-full object-cover" />
            <div class="overlay absolute top-0 left-0 w-full h-full bg-black opacity-0"></div>
            <div class="project-info absolute bottom-0 left-0 text-left text-white w-full py-3 px-4 z-10">
                <div class="font-semibold w-full leading-tight">{{ projectName }}</div>
                <div class="font-light w-full leading-tight">{{ projectPlace }}, {{ projectYear }}</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ProjectGridElement',
    props: {
        imageSrc: {
            type: Object,
            required: true
        },
        projectName: {
            type: String,
            required: true
        },
        projectYear: {
            type: String,
            required: true
        },
        projectPlace: {
            type: String,
            required: true
        },
        routeName: {
            type: String,
            required: true
        }
    },
    methods: {
        handleClick() {
            // Remove any delay in navigation
            this.$router.push(`/project/${this.routeName}`);
        }
    }
}
</script>   

<style scoped>
.project-image {
    transition: all 0.4s ease;
    filter: brightness(1) blur(0);
    transform: scale(1);
}

.project-info {
    transition: opacity 0.3s ease;
    opacity: 0;
}

.image-wrapper {
    position: relative;
    z-index: 1;
    margin: 5px;
}

.image-wrapper:hover .project-info {
    opacity: 1;
}

.image-wrapper:hover .project-image {
    filter: brightness(0.7) blur(4px);
    transform: scale(1.02);
}

.overlay {
    opacity: 0;
    mix-blend-mode: multiply;
    transition: opacity 0.3s ease;
}

.image-wrapper:hover .overlay {
    opacity: 0.2;
}
</style>