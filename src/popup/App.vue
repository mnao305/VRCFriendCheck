<template>
    <div>
        <router-view></router-view>
        <app-footer></app-footer>
    </div>
</template>

<script>
import Footer from "./router/pages/Footer.vue";
export default {
    components: {
        "app-footer": Footer,
    },
    data() {
        return {};
    },
};
</script>
