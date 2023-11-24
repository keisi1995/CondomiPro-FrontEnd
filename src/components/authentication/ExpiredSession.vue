<script setup>
    import AppConfig from '@/layout/AppConfig.vue'
    import { useToast } from 'primevue/usetoast'
</script>

<script>
    export default {
        setup() {
            window.toast = useToast()
        },
        data() {
            return {              
            }
        },
        components: {},
        methods: {
            toLogin() {
                delete localStorage.jwt
                this.$router.push('/login')
            },
            renewToken() {
                axios.post('refresh', {'access_token': localStorage.jwt}).then(respt => {
                    if (respt.status == 200) {
                        delete localStorage.jwt

                        let jwt = respt.data.data.access_token
                        localStorage.jwt = jwt
                        this.$router.push('/')
                    }
                })
            },
        },
        beforeMount() {
        },
        mounted() {
            // toast.add({ severity: 'warn', summary: 'Mensaje advertencia', detail: 'Su Sesion ha expirado', life: 3000 })
        },
        computed() {
        }
    }
</script>

<template>
    <Toast ref="myToast" position="top-right" />

    <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="flex flex-column align-items-center justify-content-center">
            <img src="/images/access/logo-orange.svg" alt="Sakai logo" class="mb-5 w-6rem flex-shrink-0" />
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, rgba(247, 149, 48, 0.4) 10%, rgba(247, 149, 48, 0) 30%)">
                <div class="w-full surface-card py-8 px-5 sm:px-8 flex flex-column align-items-center" style="border-radius: 53px">
                    <div class="grid flex flex-column align-items-center">
                        <div class="flex justify-content-center align-items-center bg-orange-500 border-circle" style="width: 3.2rem; height: 3.2rem">
                            <i class="text-50 pi pi-fw pi-lock text-2xl"></i>
                        </div>
                        <h1 class="text-900 font-bold text-4xl lg:text-5xl mb-2">La Sesion ha expirado</h1>
                        <span class="text-600 mb-5">Volver a iniciar session para continuar.</span>
                        <img src="/images/access/asset-access.svg" alt="Access denied" class="mb-5" width="80%" />
                        <div class="col-12 mt-5 text-center">
                            <i class="pi pi-fw pi-arrow-left text-blue-500 mr-2" style="vertical-align: center"></i>
                            <router-link to="#" class="text-blue-500" @click="toLogin">Ir a iniciar session</router-link>
                        </div>
                        <div class="col-12 mt-5 text-center">
                            <i class="pi pi-fw pi-arrow-left text-blue-500 mr-2" style="vertical-align: center"></i>
                            <router-link to="#" class="text-blue-500" @click="renewToken">Renovar session</router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <AppConfig simple />
</template>
