<script setup>
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    {
        label: 'Inicio',
        items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' }]
    },
    {
        label: 'Modulos',
        items: [
            {
                label: 'Mantenimiento',
                icon: 'pi pi-fw pi-bookmark',
                items: [
                    { label: 'Servicios', icon: 'pi pi-fw pi-check-square', to: '/servicios' },
                    { label: 'Socios', icon: 'pi pi-fw pi-id-card', to: '/socios' },
                ]
            },             
        ]
    },
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
