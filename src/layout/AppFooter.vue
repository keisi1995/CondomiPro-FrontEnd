<script setup>
import { useLayout } from '@/layout/composables/layout'
import { computed } from 'vue'

const { layoutConfig } = useLayout()

const logoUrl = computed(() => {
    return `layout/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`
})

const nameSoft = () => { 
    return import.meta.env.VITE_APP_NAME_SOFT
}
</script>

<template>
    <div class="layout-footer">
        <img :src="logoUrl" alt="Logo" height="20" class="mr-2" />
        by
        <span class="font-medium ml-2">{{ nameSoft() }}</span>
    </div>
</template>
<style lang="scss" scoped></style>
