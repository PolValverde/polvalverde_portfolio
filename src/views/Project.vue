<template>
    <div class="project-container">
        <div class="project-view grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="text-column">
                <div class="header text-left bg-white sticky top-0 pb-4 appear-animation delay-0">
                    <h1 class="text-xl font-semibold">{{ projectInfo?.title }}</h1>
                    <p>--> {{ projectInfo?.location }}, {{ projectInfo?.year }}</p>
                </div>
                <div class="spacer"></div>
                <div class="details grid grid-cols-1 gap-2 text-sm appear-animation delay-1">
                    <div class="grid grid-cols-2">
                        <strong>Authors</strong>
                        <ul>
                            <li v-for="(author, index) in projectInfo?.authors" :key="index">
                                {{ author.name }}
                            </li>
                        </ul>
                    </div>
                    <div class="grid grid-cols-2">
                        <strong>Contribution</strong>
                        <div>
                            {{ projectInfo?.roles.map(role => role.name).join(', ') }}
                        </div>
                    </div>
                    <div class="grid grid-cols-2">
                        <strong>Comissioned by</strong>
                        <div>{{ projectInfo?.client }}</div>
                    </div>
                    <div class="grid grid-cols-2">
                        <strong>Showcased on</strong>
                        <ul>
                            <li v-for="(showcase, index) in projectInfo?.showcases" :key="index">{{ showcase }}</li>
                        </ul>
                    </div>
                    <div class="grid grid-cols-2" v-if="projectInfo?.nextShowcases">
                        <strong>Next showcases</strong>
                        <ul>
                            <li v-for="(nextShowcase, index) in projectInfo.nextShowcases" :key="index">{{ nextShowcase }}</li>
                        </ul>
                    </div>
                    <div class="grid grid-cols-2">
                        <strong>Technologies</strong>
                        <div>
                            {{ projectInfo?.technologies.map(tech => tech.name).join(', ') }}
                        </div>
                    </div>
                </div>
                <div class="description mt-4 text-sm appear-animation delay-2">
                    <div v-html="projectInfo?.description.mainText" class="mb-2"/>
                    <div v-html="projectInfo?.description.technicalDetails" class="mb-2"/>
                </div>
            </div>
            <div class="image-column overflow-y-auto h-screen pb-24">
                <div v-if="projectInfo?.media.video" 
                     class="video-cover mb-4 appear-animation delay-3"
                     @click="openModal({ video: projectInfo.media.video })">
                    <img :src="projectInfo.media.coverImage.imageUrl" :alt="projectInfo.media.coverImage.alt">
                    <div class="play-symbol">▶</div>
                </div>
                <div v-for="(image, index) in projectInfo?.media.images" 
                     :key="index" 
                     :class="`image-item mb-4 appear-animation delay-${index + 4}`">
                    <img :src="image.imageUrl" :alt="image.alt" @click="openModal(image, index)">
                </div>
            </div>
        </div>
        <div v-if="isModalOpen" class="modal z-30" @click="closeModal">
            <div class="modal-content" @click.stop>
                <img v-if="selectedImage && !selectedImage.video" :src="selectedImage.imageUrl" :alt="selectedImage.alt || 'Project Image'">
                <iframe v-if="selectedImage && selectedImage.video" id="player" type="text/html" width="640" height="360"
                    :src="selectedImage.video.url" frameborder="0" allowfullscreen>
                </iframe>
                <p v-if="selectedImage && selectedImage.alt && !selectedImage.video" class="caption">{{ projectInfo?.title }} - {{ projectInfo?.location }}, {{ projectInfo?.year }}</p>
                <p v-if="selectedImage && !selectedImage.video && projectInfo?.media.images" class="counter">{{ selectedIndex + 1 }}/{{ projectInfo.media.images.length }}</p>
            </div>
            <span class="close" @click="closeModal">&times;</span>
            <template v-if="selectedImage && !selectedImage.video && projectInfo?.media.images">
                <div v-if="selectedIndex > 0" class="arrow left-arrow" @click.stop="prevImage">❮</div>
                <div v-if="selectedIndex < projectInfo.media.images.length - 1" class="arrow right-arrow" @click.stop="nextImage">❯</div>
            </template>
        </div>
    </div>
</template>

<script>
import contentJson from '@/assets/content.json';
import { getUploadcareUrl } from '@/utils/image';

export default {
    name: 'Project',
    data() {
        return {
            projectInfo: null,
            isModalOpen: false,
            selectedImage: null,
            selectedIndex: null,
            isExiting: false
        };
    },
    methods: {
        async fetchProject() {
            const routeName = this.$route.params.routeName;
            const project = contentJson.projects.find(project => project.routeName === routeName);
            if (project) {
                // Process images with Uploadcare URLs
                this.projectInfo = {
                    ...project,
                    media: {
                        ...project.media,
                        images: project.media.images.map(img => ({
                            ...img,
                            imageUrl: getUploadcareUrl(img.image),
                        })),
                        coverImage: {
                            ...project.media.coverImage,
                            imageUrl: getUploadcareUrl(project.media.coverImage.image)
                        }
                    }
                };
            }
        },
        openModal(item, index) {
            this.selectedImage = item;
            this.selectedIndex = index;
            this.isModalOpen = true;
            document.addEventListener('keydown', this.handleKeydown);
        },
        closeModal() {
            this.isModalOpen = false;
            this.selectedImage = null;
            this.selectedIndex = null;
            document.removeEventListener('keydown', this.handleKeydown);
        },
        prevImage() {
            if (this.selectedIndex > 0 && this.projectInfo?.media.images) {
                this.selectedIndex--;
                this.selectedImage = this.projectInfo.media.images[this.selectedIndex];
            }
        },
        nextImage() {
            if (this.projectInfo?.media.images && 
                this.selectedIndex < this.projectInfo.media.images.length - 1) {
                this.selectedIndex++;
                this.selectedImage = this.projectInfo.media.images[this.selectedIndex];
            }
        },
        handleKeydown(event) {
            if (event.key === 'ArrowLeft') {
                this.prevImage();
            } else if (event.key === 'ArrowRight') {
                this.nextImage();
            }
        }
    },
    mounted() {
        this.fetchProject();
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.fetchProject();
        });
    },
    beforeRouteLeave(to, from, next) {
        this.isExiting = true;
        if (to.name === 'home') {
            document.body.style.backgroundColor = 'white';
            next(); // Immediately navigate to home
        } else {
            setTimeout(() => {
                next();
            }, 300);
        }
    },
    unmounted() {
        // Clean up any lingering styles
        document.body.style.removeProperty('background-color');
    }
};
</script>

<style scoped>
html, body {
    height: 100%;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch; /* Enable smooth scrolling on iOS */
}

.project-view {
    position: relative;
    /* Desktop styles */
    @media (min-width: 768px) {
        height: calc(100vh - 12rem);
        overflow: hidden;
    }
    /* Mobile styles */
    @media (max-width: 767px) {
        min-height: calc(100vh - 12rem);
        overflow: visible;
    }
}

.header {
    margin-bottom: 1rem;
}

.spacer {
    margin-bottom: 2rem;
}

.text-column {
    /* Desktop styles */
    @media (min-width: 768px) { /* md breakpoint */
        height: 100%;
        overflow-y: auto;
        position: relative; /* Remove sticky */
        -webkit-overflow-scrolling: touch;
        padding-right: 2rem;
    }
    /* Mobile styles */
    @media (max-width: 767px) {
        height: auto;
        overflow: visible;
        padding-right: 0;
    }
}

.image-column {
    /* Desktop styles */
    @media (min-width: 768px) { /* md breakpoint */
        height: 100%;
        overflow-y: auto;
        position: relative; /* Remove sticky */
        top: 6rem;
        -webkit-overflow-scrolling: touch;
    }
    /* Mobile styles */
    @media (max-width: 767px) {
        height: auto;
        overflow: visible;
        padding-bottom: 4rem;
    }
}

.image-item img {
    max-width: 100%;
    object-fit: contain;
    cursor: pointer;
}

.video-cover {
    position: relative;
    cursor: pointer;
}

.video-cover img {
    max-width: 100%;
    object-fit: contain;
    filter: brightness(0.5); /* Darken the cover image */
}

.play-symbol {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 3rem;
    color: white;
    text-shadow: 0 0 10px rgba(0, 0, 0, 0.7);
}

.modal {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.8);
    box-sizing: border-box;
    overflow-y: auto; /* Enable scrolling for the modal */
    -webkit-overflow-scrolling: touch; /* Enable smooth scrolling on iOS */
}

.modal-content {
    position: relative;
    max-width: 90%;
    max-height: 90%;
}

.modal-content img {
    max-width: 80vw;
    max-height: 80vh; /* Adjust height to the maximum height of the parent */
}

.modal-content video {
    max-width: 80vw;
    max-height: 80vh;
}

.modal-content iframe {
    width: 80vw;
    height: 80vh;
}

.close {
    position: fixed;
    top: 20px; /* Increase padding from the edge */
    right: 20px; /* Increase padding from the edge */
    font-size: 3rem; /* Make the icon larger */
    font-weight: 300; /* Decrease the font weight */
    color: white;
    cursor: pointer;
    z-index: 1000;
    width: 40px; /* Make the icon slimmer */
    height: 40px; /* Make the icon slimmer */
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-content .caption {
    margin-top: 1rem;
    text-align: center;
    color: white; /* Change font color to white */
}

.modal-content .counter {
    text-align: center;
    color: white; /* Change font color to white */
}

.arrow {
    position: fixed;
    top: 50%;
    transform: translateY(-50%);
    font-size: 3rem; /* Make the icons larger */
    font-weight: 300; /* Decrease the font weight */
    color: white;
    cursor: pointer;
    user-select: none;
    z-index: 1000;
    padding: 20px; /* Increase padding */
    width: 40px; /* Make the icons slimmer */
    height: 80px; /* Make the icons slimmer */
    display: flex;
    justify-content: center;
    align-items: center;
}

.left-arrow {
    left: 20px; /* Increase padding from the edge */
}

.right-arrow {
    right: 20px; /* Increase padding from the edge */
}

.description-paragraph {
    margin-top: 1rem !important;
    color: #333; /* Adjust text color */
}

a {
    color: #1a73e8; /* Adjust link color */
    text-decoration: underline;
}

:root {
    --animation-base-delay: 0.1s;
}

.appear-animation {
    opacity: 0;
    filter: blur(5px);
    animation: appearBlur 0.7s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.delay-0 { animation-delay: 0.1s; }  /* Title */
.delay-1 { animation-delay: 0.2s; }  /* Details */
.delay-2 { animation-delay: 0.3s; }  /* Description */
.delay-3 { animation-delay: 0.5s; }  /* Video cover if exists */
.delay-4 { animation-delay: 0.6s; }  /* First image */
.delay-5 { animation-delay: 0.7s; }  /* Second image */
.delay-6 { animation-delay: 0.8s; }
.delay-7 { animation-delay: 0.9s; }
.delay-8 { animation-delay: 1.0s; }
.delay-9 { animation-delay: 1.1s; }
.delay-10 { animation-delay: 1.2s; }

@keyframes appearBlur {
    to {
        opacity: 1;
        filter: blur(0);
    }
}

.exit-animation {
    animation: disappear 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards !important;
}

@keyframes disappear {
    to {
        opacity: 0;
        filter: blur(5px);
    }
}

@keyframes fadeIn {
    from { opacity: 0; filter: blur(5px); }
    to { opacity: 1; filter: blur(0); }
}

.project-container {
    width: 100%;
    height: 100%;
}
</style>