<script setup>
    import { useLayout } from '@/layout/composables/layout';
    import { computed } from 'vue';
    import AppConfig from '@/layout/AppConfig.vue';
    const { layoutConfig } = useLayout();

    const logoUrl = computed(() => {
        return `layout/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`;
    });
</script>

<script>
    export default {
        setup() {            
        },
        data() {
            return {
                fields: {
                    email: null,
                    password: null,
                    checked: false
                },
                errors: {},
                error: null
            }
        },
        components: {},
        methods: {
            login() {
                axios.post('autenticar', this.fields).then(respt => {
                    if (respt.status == 200) {
                        let jwt = respt.data.data.access_token
                        localStorage.jwt = jwt
                        this.$router.push('/')
                    }
                }).catch(respt => {
                    const arrResponse = helpers.printError(respt)
                    this.errors = arrResponse.errors
                    this.error = arrResponse.messageError
                })
            },
        },
        beforeMount() {
        },
        mounted() {
        },
    }
</script>

<template>
    <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="flex flex-column align-items-center justify-content-center">
            <img :src="logoUrl" alt="Sakai logo" class="mb-5 w-6rem flex-shrink-0" />
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
                    <div class="text-center mb-5">
                        <!-- <img src="/demo/images/login/avatar.png" alt="Image" height="50" class="mb-3" /> -->
                        <div class="text-900 text-3xl font-medium mb-3">¡¡Bienvenidos!!</div>
                        <span class="text-600 font-medium">Iniciar sesion para continuar</span>
                    </div>

                    <div>                        
                        <div class="field p-fluid">
                            <label for="usuario" class="block text-900 font-medium text-xl mb-2">Usuario</label>
                            <InputText
                                id="usuario"
                                type="text"
                                v-model="fields.usuario"
                                placeholder="Ingrese el usuario"
                                class="w-full mb-1"
                                :inputStyle="{ padding: '1rem' }"
                                inputClass="w-full"
                                maxlength="20"
                                :class="{ 'p-invalid': errors.usuario }"
                            />
                            <small id="username-help" class="p-error" v-if="errors.usuario">{{ errors.usuario[0] }}</small>
                        </div>
                        

                        <div class="field p-fluid">
                            <label for="password1" class="block text-900 font-medium text-xl mb-2">Contraseña</label>                        
                            <Password
                                id="password1"
                                v-model="fields.clave"
                                placeholder="Ingrese la contraseña"
                                class="w-full mb-1"
                                :inputStyle="{ padding: '1rem' }"                                
                                inputClass="w-full"
                                :toggleMask="true"
                                maxlength="20"
                                :class="{ 'p-invalid': errors.clave }"
                            >
                            </Password>
                            <small id="password-help" class="p-error" v-if="errors.clave">{{ errors.clave[0] }}</small>
                        </div>
                     
                        <div class="flex align-items-center justify-content-between mb-5 gap-5">
                            <div class="flex align-items-center">
                                <Checkbox
                                    id="rememberme1"
                                    v-model="fields.checked"
                                    binary class="mr-2">
                                </Checkbox>
                                <label for="rememberme1">Recordarme</label>
                            </div>
                            <a class="font-medium no-underline ml-2 text-right cursor-pointer" style="color: var(--primary-color)">Olvidastes tu clave?</a>
                        </div>
                        
                        <Button label="Iniciar Sesión" class="w-full p-3 text-xl mb-1" @click="login"></Button>
                        <small id="error-help" class="p-error" v-if="error">{{ error }}</small>                        
                    </div>
                </div>
            </div>
        </div>
    </div>
    <AppConfig simple />
</template>

<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
</style>
