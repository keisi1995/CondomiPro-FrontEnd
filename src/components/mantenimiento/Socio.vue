<script>
    import { FilterMatchMode, FilterOperator } from 'primevue/api'
    import { useToast } from 'primevue/usetoast'
    
    export default {
        setup() {
            window.toast = useToast()
        },
        data() {
            return {
                socios: [],
                fields: {},
                productDialog: false,
                deleteProductDialog: false,
                filters: {},
                errors: {},
                objTipoDocumento: [],
                objTipoPersona: [],
                objDepartamento: [],
                objProvincia: [],
                objDistrito: [],
                dt: null
            }
        },
        components: {},
        methods: {
            async initCombo() {
                this.objTipoDocumento = await helpers.getDataCombo('tipodocumento', {id: 'id_tipo_documento', name: 'descripcion'})
                this.objTipoPersona = await helpers.getDataCombo('tipopersona', {id: 'id_tipo_persona', name: 'descripcion'})
                this.objDepartamento = await helpers.arrDepartamento()
            },
            async evnChangeDepartamento() {
                this.objProvincia = await helpers.arrProvincia(this.fields)
                this.objDistrito = []
            },
            async evnChangeProvincia() {
                this.objDistrito = await helpers.arrDistrito(this.fields)
            },
            async modalEditar(objProducto) {
                this.fields = { ...objProducto }
                this.errors = {}
                this.productDialog = true

                this.objProvincia = await helpers.arrProvincia(this.fields)
                this.objDistrito = await helpers.arrDistrito(this.fields)
            },
            fnListar() {
                axios.get('socio').then(respt => {
                    if (respt.status == 200) {
                        this.socios = respt.data.data
                    }
                }).catch(respt => {
                    const arrResponse = helpers.printError(respt)
                    helpers.printAlert('warn', arrResponse.messageError)
                })
            },
            fnGrabar() {
                if (!this.fields.id_socio) {
                    axios.post('socio', this.fields, helpers.configHeader()).then(respt => {
                        const response = respt.data
                        if (respt.status == 201) {
                            toast.add({ severity: 'success', summary: 'Mensaje exitoso', detail: response.message, life: 3000 })
                            this.productDialog = false
                            this.fields = {}
                            this.fnListar()
                        }
                    }).catch(respt => {
                        const arrResponse = helpers.printError(respt)
                        this.errors = arrResponse.errors                        
                        helpers.printAlert('warn', arrResponse.messageError)
                    })
                } else {
                    axios.put('socio' + this.fields.id_socio, this.fields, helpers.configHeader()).then(respt => {
                        const response = respt.data
                        if (respt.status == 200) {
                            toast.add({ severity: 'success', summary: 'Mensaje exitoso', detail: response.message, life: 3000 })
                            this.productDialog = false
                            this.fields = {}
                            this.fnListar()
                        }
                    }).catch(respt => {
                        const arrResponse = helpers.printError(respt)
                        this.errors = arrResponse.errors
                        helpers.printAlert('warn', arrResponse.messageError)
                    })
                }
            },
            eliminar () {
                const id_socio = this.fields.id_socio
                axios.delete('socio' + id_socio, helpers.configHeader()).then(respt => {
                    const response = respt.data
                    if (respt.status == 200) {
                        toast.add({ severity: 'success', summary: 'Mensaje exitoso', detail: response.message, life: 3000 })
                        this.deleteProductDialog = false
                        this.fields = {}
                        this.fnListar()
                    }
                }).catch(respt => {
                    const arrResponse = helpers.printError(respt)
                    helpers.printAlert('warn', arrResponse.messageError)
                })
            },
            openNew() {
                this.fields = {}
                this.errors = {}
                this.productDialog = true
            },
            initFilters() {
                this.filters = {
                    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
                    nombres: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
                    apellidos: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
                    correo: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
                    direccion: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
                    tipo_documento: { value: null, matchMode: FilterMatchMode.IN },
                    departamento: { value: null, matchMode: FilterMatchMode.IN },
                    provincia: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
                    distrito: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
                }
            },
            modalEliminar(objProducto) {
                this.fields = objProducto
                this.deleteProductDialog = true
            }
        },
        beforeMount() {
            this.initFilters()            
        },
        mounted() {
            this.initCombo()
            this.fnListar()
        },
        computed() {
        }
    }
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <Toast ref="myToast" position="top-right" />
                <Toolbar class="mb-4">
                    <template v-slot:start>
                        <div class="my-2">
                            <Button type="button" icon="pi pi-filter-slash" label="Clear" class="p-button-outlined mb-2" @click="this.initFilters()" />
                        </div>
                    </template>

                    <template v-slot:end>
                        <Button label="Nuevo" icon="pi pi-plus" class="p-button-info mr-2" @click="openNew" />
                        <Button label="Buscar" icon="pi pi-search" class="p-button-info mr-2" @click="fnListar" />
                        <Button label="Exportar" icon="pi pi-upload" class="p-button-success" @click="this.$refs.dt.exportCSV()" />
                    </template>
                </Toolbar>

                <DataTable
                    ref="dt"
                    :value="socios"
                    dataKey="id"
                    :paginator="true"
                    :rows="10"
                    :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                    responsiveLayout="scroll"
                    :rowHover="true"
                    :globalFilterFields="['nombres', 'apellidos', 'direccion']"

                    class="p-datatable-gridlines"
                    filterDisplay="menu"
                    v-model:filters="filters"
                >
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                            <h5 class="m-0">Mantenimiento de socios</h5>
                            <span class="block mt-2 md:mt-0 p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global'].value" placeholder="Search..." />
                            </span>
                        </div>
                    </template>

                    <Column field="id_socio" header="Id Socio" :sortable="true" headerStyle="width:5%; min-width:5rem;">
                        <template #body="{ data }">
                            <span class="p-column-title">Id Socio</span>
                            {{ data.id_socio }}
                        </template>
                    </Column>

                    <Column field="tipo_persona" header="Tipo Persona" :sortable="true" headerStyle="width:14%; min-width:10rem;" filterField="tipo_documento" :showFilterMatchModes="false" :filterMenuStyle="{ width: '20rem' }">
                        <template #body="{ data }">
                            <span class="p-column-title">Tipo Persona</span>
                            {{ data.tipo_persona }}
                        </template>

                        <template #filter="{ filterModel }">
                            <div class="mb-3 text-bold">Tipo Persona</div>
                            <MultiSelect v-model="filterModel.value" :options="objTipoPersona" optionLabel="name" optionValue="name" placeholder="Any" class="p-column-filter"></MultiSelect>
                        </template>
                    </Column>

                    <Column field="nombres" header="Nombres" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="{ data }">
                            <span class="p-column-title">Nombres</span>
                            {{ data.nombres }}
                        </template>

                        <template #filter="{ filterModel }">
                            <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Ingrese el texto a buscar" />
                        </template>
                    </Column>
                    
                    <Column field="apellidos" header="Apellidos" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="{ data }">
                            <span class="p-column-title">Apellidos</span>
                            {{ data.apellidos }}
                        </template>

                        <template #filter="{ filterModel }">
                            <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Ingrese el texto a buscar" />
                        </template>
                    </Column>
                   
                    <Column field="correo" header="Correo" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="{ data }">
                            <span class="p-column-title">Correo</span>
                            {{ data.correo }}
                        </template>

                        <template #filter="{ filterModel }">
                            <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Ingrese el texto a buscar" />
                        </template>
                    </Column>

                    <Column field="telefono" header="Telefono" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="{ data }">
                            <span class="p-column-title">Telefono</span>
                            {{ data.telefono }}
                        </template>

                        <template #filter="{ filterModel }">
                            <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Ingrese el texto a buscar" />
                        </template>
                    </Column>

                    <Column field="direccion" header="Dirección" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="{ data }">
                            <span class="p-column-title">Dirección</span>
                            {{ data.direccion }}
                        </template>

                        <template #filter="{ filterModel }">
                            <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Ingrese el texto a buscar" />
                        </template>
                    </Column>

                    <Column field="tipo_documento" header="Tipo de Documento" :sortable="true" headerStyle="width:14%; min-width:10rem;" filterField="tipo_documento" :showFilterMatchModes="false" :filterMenuStyle="{ width: '20rem' }">
                        <template #body="{ data }">
                            <span class="p-column-title">Tipo de Documento</span>
                            {{ data.tipo_documento }}
                        </template>

                        <template #filter="{ filterModel }">
                            <div class="mb-3 text-bold">Tipo de Documento</div>
                            <MultiSelect v-model="filterModel.value" :options="objTipoDocumento" optionLabel="name" optionValue="name" placeholder="Any" class="p-column-filter"></MultiSelect>
                        </template>
                    </Column>

                    <Column field="departamento" header="Departamento" :sortable="true" headerStyle="width:14%; min-width:10rem;" filterField="departamento" :showFilterMatchModes="false" :filterMenuStyle="{ width: '20rem' }">
                        <template #body="{ data }">
                            <span class="p-column-title">Departamento</span>
                            {{ data.departamento }}
                        </template>

                        <template #filter="{ filterModel }">
                            <div class="mb-3 text-bold">Departamento</div>
                            <MultiSelect v-model="filterModel.value" :options="objDepartamento" optionLabel="name" optionValue="name" placeholder="Any" class="p-column-filter"></MultiSelect>
                        </template>
                    </Column>
                    
                    <Column field="provincia" header="Provincia" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="{ data }">
                            <span class="p-column-title">Provincia</span>
                            {{ data.provincia }}
                        </template>

                        <template #filter="{ filterModel }">
                            <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Ingrese el texto a buscar" />
                        </template>
                    </Column>

                    <Column field="distrito" header="Distrito" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="{ data }">
                            <span class="p-column-title">Distrito</span>
                            {{ data.distrito }}
                        </template>

                        <template #filter="{ filterModel }">
                            <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Ingrese el texto a buscar" />
                        </template>
                    </Column>

                    <Column header="Acción" headerStyle="min-width:10rem;">
                        <template #body="{ data }">
                            <Button icon="pi pi-pencil" class="p-button-rounded p-button-info mr-2" @click="modalEditar(data)" />
                            <Button icon="pi pi-trash" class="p-button-rounded p-button-danger mt-2" @click="modalEliminar(data)" />
                        </template>
                    </Column>
                </DataTable>

                <Dialog v-model:visible="productDialog" :style="{ width: '80%', maxWidth: '800px' }" header="Registro de Socios" :modal="true" class="p-fluid">                    
                    
                    <div class="field" style="display:none">
                        <label for="txtIDProducto">Id Socio</label>
                        <InputText
                            id="txtIDProducto"
                            v-model="fields.id_socio"
                        />
                    </div>

                    <div class="formgrid grid">
                        <div class="field col">
                            <label for="cbxTipoPersona">Tipo de Persona</label>
                            <Dropdown
                                id="cbxTipoPersona"
                                v-model="fields.id_tipo_persona"
                                :options="objTipoPersona"
                                filter
                                showClear
                                optionLabel="name"
                                optionValue="code"
                                dataKey="code"
                                placeholder="Seleccionar"
                                :class="{ 'p-invalid': errors.id_tipo_persona }"                            
                            />
                            <small class="p-invalid" v-if="errors.id_tipo_persona">{{ errors.id_tipo_persona[0] }}</small>  
                        </div>
                        <div class="field col">
                            <label for="cbxTipoDocumento">Tipo de Documento</label>
                            <Dropdown
                                id="cbxTipoDocumento"
                                v-model="fields.id_tipo_documento"
                                :options="objTipoDocumento"
                                filter
                                showClear
                                optionLabel="name"
                                optionValue="code"
                                dataKey="code"
                                placeholder="Seleccionar"
                                :class="{ 'p-invalid': errors.id_tipo_documento }"                            
                            />
                            <small class="p-invalid" v-if="errors.id_tipo_documento">{{ errors.id_tipo_documento[0] }}</small>  
                        </div>
                        <div class="field col">
                            <label for="txtNroDocumento">Nro Documento</label>
                            <InputText
                                id="txtNroDocumento"
                                v-model.trim="fields.nro_documento"
                                :class="{ 'p-invalid': errors.nro_documento }"
                                maxlength="20"
                                :required="true"
                            />
                            <small class="p-invalid" v-if="errors.nro_documento">{{ errors.nro_documento[0] }}</small>
                        </div>
                    </div>
                
                    <div class="field">
                        <label for="txtNombre">Nombres</label>
                        <InputText
                            id="txtNombre"
                            v-model.trim="fields.nombres"                            
                            :class="{ 'p-invalid': errors.nombres }"
                            maxlength="100"
                            :required="true" 
                        />
                        <small class="p-invalid" v-if="errors.nombres">{{ errors.nombres[0] }}</small>
                    </div>

                    <div class="field">
                        <label for="txtApellidos">Apellidos</label>
                        <InputText
                            id="txtApellidos"
                            v-model.trim="fields.apellidos"                            
                            :class="{ 'p-invalid': errors.apellidos }"
                            maxlength="100"
                            :required="true" 
                        />
                        <small class="p-invalid" v-if="errors.apellidos">{{ errors.apellidos[0] }}</small>
                    </div>

                    <div class="field">
                        <label for="txtCorreo">Correo</label>
                        <InputText
                            id="txtCorreo"
                            v-model.trim="fields.correo"                            
                            :class="{ 'p-invalid': errors.correo }"
                            maxlength="100"
                            :required="true" 
                        />
                        <small class="p-invalid" v-if="errors.correo">{{ errors.correo[0] }}</small>
                    </div>

                    <div class="field">
                        <label for="txtTelefono">Telefono</label>
                        <InputText
                            id="txtTelefono"
                            v-model.trim="fields.telefono"                            
                            :class="{ 'p-invalid': errors.telefono }"
                            maxlength="100"
                            :required="true" 
                        />
                        <small class="p-invalid" v-if="errors.telefono">{{ errors.telefono[0] }}</small>
                    </div>

                    <div class="field">
                        <label for="txtDireccion">Direccion</label>
                        <InputText
                            id="txtDireccion"
                            v-model.trim="fields.direccion"                            
                            :class="{ 'p-invalid': errors.direccion }"
                            maxlength="100"
                            :required="true" 
                        />
                        <small class="p-invalid" v-if="errors.direccion">{{ errors.direccion[0] }}</small>
                    </div>

                    <div class="formgrid grid">
                        <div class="field col">
                            <label for="cbxDepartamento">Departamento</label>
                            <Dropdown
                                id="cbxDepartamento"
                                v-model="fields.id_departamento"
                                :options="objDepartamento"
                                filter
                                showClear
                                :virtualScrollerOptions="{ itemSize: 38 }"
                                optionLabel="name"
                                optionValue="code"
                                placeholder="Seleccionar"
                                :class="{ 'p-invalid': errors.id_departamento }"
                                @change="evnChangeDepartamento"
                            />
                            <small class="p-invalid" v-if="errors.id_departamento">{{ errors.id_departamento[0] }}</small>
                        </div>

                        <div class="field col">
                            <label for="cbxProvincia">Provincia</label>
                            <Dropdown
                                id="cbxProvincia"
                                v-model="fields.id_provincia"
                                :options="objProvincia"
                                filter
                                showClear
                                optionLabel="name"
                                optionValue="code"
                                dataKey="code"
                                placeholder="Seleccionar"
                                :class="{ 'p-invalid': errors.id_provincia }"
                                @change="evnChangeProvincia"
                            />
                            <small class="p-invalid" v-if="errors.id_provincia">{{ errors.id_provincia[0] }}</small>
                        </div>

                        <div class="field col">
                            <label for="cbxDistrito">Distrito</label>
                            <Dropdown
                                id="cbxDistrito"
                                v-model="fields.id_distrito"
                                :options="objDistrito"
                                filter
                                showClear
                                optionLabel="name"
                                optionValue="code"
                                dataKey="code"
                                placeholder="Seleccionar"
                                :class="{ 'p-invalid': errors.id_distrito }"                            
                            />
                            <small class="p-invalid" v-if="errors.id_distrito">{{ errors.id_distrito[0] }}</small>                        
                        </div>
                    </div>
                                    
                    <template #footer>
                        <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="this.productDialog = false" />
                        <Button label="Save" icon="pi pi-check" class="p-button-text" @click="fnGrabar" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteProductDialog" :style="{ width: '450px' }" header="Confirmar" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="fields">Esta seguro que desea eliminar el socio <b>{{ fields.name }}</b>?</span>
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteProductDialog = false" />
                        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="eliminar" />
                    </template>
                </Dialog>
            </div>
        </div>
    </div>
</template>
 
<style scoped lang="scss">
    /* Estilos para pantallas más pequeñas */
    /*@media (max-width: 600px) {
    .p-dialog {
        width: 90%;
        max-width: none;
    }
    }*/

    /* Estilos para pantallas medianas */
    /*@media (min-width: 601px) and (max-width: 1200px) {
    .p-dialog {
        width: 70%;
        max-width: none;
    }
    }*/

    /* Estilos para pantallas más grandes */
    /*@media (min-width: 1201px) {
    .p-dialog {
        width: 60%;
        max-width: 800px;
    }
    }*/
</style>
