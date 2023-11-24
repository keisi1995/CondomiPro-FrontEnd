<script>
    import { FilterMatchMode, FilterOperator } from 'primevue/api'
    import { useToast } from 'primevue/usetoast'
    import { ref } from 'vue'
    
    export default {
        setup() {
            window.toast = useToast()
        },
        data() {
            return {
                products: [],
                fields: {},
                productDialog: false,
                deleteProductDialog: false,
                filters: {},
                errors: {},
                CbxCategoria: [],
                CbxMarca: [],
                dt: null
            }
        },
        components: {},
        methods: {
            changeCombo() {
                // console.log('change:' + this.fields.id_marca)
                // this.$refs.myToast.add({ severity: 'warn', summary: 'Warn Messag', detail: 'test', life: 3000 })
            }, 
            fnListar() {
                axios.get('/api/producto/', []).then(respt => {
                    if (respt.status == 200) {
                        this.products = respt.data.data
                    }
                }).catch(respt => {
                    if (respt.response.status == 422) {
                        toast.add({ severity: 'warn', summary: 'Warn Messag', detail: respt.response.data.message, life: 3000 })
                        this.errors = respt.response.data.errors
                    }
                    if (respt.response.status == 500) {
                        toast.add({ severity: 'warn', summary: 'Warn Messag', detail: respt.response.data.message, life: 3000 })
                    }
                })
            },
            fnGrabar() {
                if (!this.fields.id_producto) {
                    axios.post('/api/producto/', this.fields).then(respt => {
                        if (respt.status == 201) {
                            toast.add({ severity: 'success', summary: 'Successful', detail: respt.data.message, life: 3000 })
                            this.productDialog = false
                            this.fields = {}
                            this.fnListar()
                        } else {
                            toast.add({ severity: 'warn', summary: 'Warn Messag', detail: respt.data.message, life: 3000 })
                        }
                    }).catch(respt => {
                        if (respt.response.status == 422) {
                            toast.add({ severity: 'warn', summary: 'Warn Messag', detail: respt.response.data.message, life: 3000 })
                            this.errors = respt.response.data.errors
                        }
                        if (respt.response.status == 500) {
                            toast.add({ severity: 'warn', summary: 'Warn Messag', detail: respt.response.data.message, life: 3000 })
                        }
                    })
                } else {
                    axios.put('/api/producto/' + this.fields.id_producto, this.fields).then(respt => {
                        if (respt.status == 200) {
                            toast.add({ severity: 'success', summary: 'Successful', detail: respt.data.message, life: 3000 })
                            this.productDialog = false
                            this.fields = {}
                            this.fnListar()
                        }
                    }).catch(respt => {
                        if (respt.response.status == 422) {
                            toast.add({ severity: 'warn', summary: 'Warn Messag', detail: respt.response.data.message, life: 3000 })
                            this.errors = respt.response.data.errors
                        }
                        if (respt.response.status == 500) {
                            toast.add({ severity: 'warn', summary: 'Warn Messag', detail: respt.response.data.message, life: 3000 })
                        }
                    })
                }
            },            
            eliminar () {
                let id_producto = this.fields.id_producto
                axios.delete('/api/producto/' + id_producto).then(respt => {
                    if (respt.status == 200) {
                        toast.add({ severity: 'success', summary: 'Successful', detail: respt.data.message, life: 3000 })
                        this.deleteProductDialog = false
                        this.fields = {}
                        this.fnListar()
                    }
                }).catch(respt => {
                    if (respt.response.status == 422) {
                        toast.add({ severity: 'warn', summary: 'Warn Messag', detail: respt.response.data.message, life: 3000 })
                        this.errors = respt.response.data.errors
                    }
                    if (respt.response.status == 500) {
                        toast.add({ severity: 'warn', summary: 'Warn Messag', detail: respt.response.data.message, life: 3000 })
                    }
                })
            },
            lsCategoria() {
                axios.get('/api/categoria/', this.fields).then(respt => {
                    if (respt.status == 200) {
                        let objCategoria = respt.data.data
                        objCategoria.forEach((value, index) => {
                            this.CbxCategoria.push({ name: value.nombre, code: value.id_categoria})
                        });
                    }
                }).catch(respt => {
                    if (respt.response.status == 422) { console.log(respt.response.data.errors) }
                    if (respt.response.status == 500) { console.log(respt.response.data.message) }
                })
            },
            lsMarca() {                            
                axios.get('/api/marca/', this.fields).then(respt => {
                    if (respt.status == 200) {
                        let objMarca = respt.data.data
                        objMarca.forEach((value, index) => {
                            this.CbxMarca.push({ name: value.nombre, code: value.id_marca})
                        });
                    }
                }).catch(respt => {
                    if (respt.response.status == 422) { console.log(respt.response.data.errors) }
                    if (respt.response.status == 500) { console.log(respt.response.data.message) }
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
                    nombre: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
                    descripcion: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
                    precio: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
                    stock: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
                    nombre_categorias: { value: null, matchMode: FilterMatchMode.IN },
                    nombre_marcas: { value: null, matchMode: FilterMatchMode.IN },
                }
            },
            clearFilter() {
                this.initFilters()
            },
            hideDialog() {
                this.productDialog = false
            },           
            exportCSV() {
                this.$refs.dt.exportCSV()
            },
            modalEditar(objProducto) {
                this.fields = { ...objProducto }
                this.errors = {}
                this.productDialog = true
            },
            modalEliminar(objProducto) {
                this.fields = objProducto
                this.deleteProductDialog = true
            },
            formatCurrency(value) {
                return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
            }
        },
        computed: {
            // setValue: {
            //     get: function () {
            //         return this.paramet.id_combobox_det
            //     },
            //     set: function (newValue) {
            //         this.$emit('emitCombobox', newValue)
            //     }
            // },
        },
        beforeMount() {
            this.initFilters()
        },
        mounted() {            
            this.fnListar()
            this.lsCategoria()
            this.lsMarca()
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
                            <Button type="button" icon="pi pi-filter-slash" label="Clear" class="p-button-outlined mb-2" @click="clearFilter()" />
                        </div>
                    </template>

                    <template v-slot:end>
                        <Button label="Nuevo" icon="pi pi-plus" class="p-button-info mr-2" @click="openNew" />
                        <Button label="Buscar" icon="pi pi-search" class="p-button-info mr-2" @click="fnListar" />
                        <Button label="Exportar" icon="pi pi-upload" class="p-button-success" @click="exportCSV($event)" />
                    </template>
                </Toolbar>

                <DataTable
                    ref="dt"
                    :value="products"
                    dataKey="id"
                    :paginator="true"
                    :rows="10"
                    :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                    responsiveLayout="scroll"
                    :rowHover="true"
                    :globalFilterFields="['nombre', 'descripcion', 'nombre_categorias', 'nombre_marcas']"

                    class="p-datatable-gridlines"
                    filterDisplay="menu"
                    v-model:filters="filters"
                >
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                            <h5 class="m-0">Mantenimiento de productos</h5>
                            <span class="block mt-2 md:mt-0 p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global'].value" placeholder="Search..." />
                            </span>
                        </div>
                    </template>

                    <Column field="Id" header="Id" :sortable="true" headerStyle="width:5%; min-width:5rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Id</span>
                            {{ slotProps.data.id_producto }}
                        </template>
                    </Column>

                    <Column field="nombre" header="Nombre" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Nombre</span>
                            {{ slotProps.data.nombre }}
                        </template>

                        <template #filter="{ filterModel }">
                            <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Buscar por nombre" />
                        </template>
                    </Column>
                    
                    <Column field="descripcion" header="Descripcion" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Descripcion</span>
                            {{ slotProps.data.descripcion }}
                        </template>

                        <template #filter="{ filterModel }">
                            <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Buscar por descripcion" />
                        </template>
                    </Column>
                   
                    <Column field="precio" header="Precio" :sortable="true" headerStyle="width:14%; min-width:10rem;" dataType="numeric">
                        <template #body="slotProps">
                            <span class="p-column-title">Precio</span>
                            {{ formatCurrency(parseFloat(slotProps.data.precio)) }}
                        </template>
                        <template #filter="{ filterModel }">
                            <InputNumber v-model="filterModel.value" class="p-column-filter" mode="currency" currency="USD" locale="en-US" />
                        </template>
                    </Column>

                    <Column field="stock" header="Stock" :sortable="true" headerStyle="width:14%; min-width:10rem;" dataType="numeric">
                        <template #body="slotProps">
                            <span class="p-column-title">Stock</span>
                            {{ slotProps.data.stock }}
                        </template>
                        <template #filter="{ filterModel }">
                            <InputNumber v-model="filterModel.value" class="p-column-filter"/>
                        </template>
                    </Column>

                    <Column field="nombre_categorias" header="Categoria" :sortable="true" headerStyle="width:14%; min-width:10rem;" filterField="nombre_categorias" :showFilterMatchModes="false" :filterMenuStyle="{ width: '20rem' }">
                        <template #body="slotProps">
                            <span class="p-column-title">Categorias</span>
                            {{ slotProps.data.nombre_categorias }}
                        </template>

                        <template #filter="{ filterModel }">
                            <div class="mb-3 text-bold">Categorias</div>
                            <MultiSelect v-model="filterModel.value" :options="CbxCategoria" optionLabel="name" optionValue="name" placeholder="Any" class="p-column-filter"></MultiSelect>
                        </template>
                    </Column>

                    <Column field="nombre_marcas" header="Marcas" :sortable="true" headerStyle="width:14%; min-width:10rem;" filterField="nombre_marcas" :showFilterMatchModes="false" :filterMenuStyle="{ width: '20rem' }">
                        <template #body="slotProps">
                            <span class="p-column-title">Marcas</span>
                            {{ slotProps.data.nombre_marcas }}
                        </template>

                        <template #filter="{ filterModel }">
                            <div class="mb-3 text-bold">Marcas</div>
                            <MultiSelect v-model="filterModel.value" :options="CbxMarca" optionLabel="name" optionValue="name" placeholder="Any" class="p-column-filter"></MultiSelect>
                        </template>
                    </Column>
                    
                    <!-- <Column field="Status" header="Status" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Status</span>
                            <span :class="'product-badge status-' + (slotProps.data.inventoryStatus ? slotProps.data.inventoryStatus.toLowerCase() : '')">{{ slotProps.data.inventoryStatus }}</span>
                        </template>
                    </Column> -->
                   
                    <Column headerStyle="min-width:10rem;">
                        <template #body="slotProps">
                            <Button icon="pi pi-pencil" class="p-button-rounded p-button-info mr-2" @click="modalEditar(slotProps.data)" />
                            <Button icon="pi pi-trash" class="p-button-rounded p-button-danger mt-2" @click="modalEliminar(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>

                <Dialog v-model:visible="productDialog" :style="{ width: '450px' }" header="Registro de Productos" :modal="true" class="p-fluid">                    
                    <div class="field" style="display:none">
                        <label for="txtIDProducto">Id Producto</label>
                        <InputText
                            id="txtIDProducto"
                            v-model="fields.id_producto"
                        />
                    </div>

                    <div class="field">
                        <label for="txtNombre">Nombre</label>
                        <InputText
                            id="txtNombre"
                            v-model.trim="fields.nombre"                            
                            :class="{ 'p-invalid': errors.nombre }"
                            :required="true" 
                        />
                        <small class="p-invalid" v-if="errors.nombre">{{ errors.nombre[0] }}</small>
                    </div>
                    
                    <div class="field">
                        <label for="txtDescripcion">Descripcion</label>
                        <Textarea
                            id="txtDescripcion"
                            v-model.trim="fields.descripcion"
                            rows="3"
                            cols="20"
                            :class="{ 'p-invalid': errors.descripcion }"
                            :required="true"
                        />
                        <small class="p-invalid" v-if="errors.descripcion">{{ errors.descripcion[0] }}</small>
                    </div>
                    
                    <div class="formgrid grid">
                        <div class="field col">
                            <label for="txtPrecio">Precio</label>
                            <InputNumber 
                                id="txtPrecio" 
                                v-model="fields.precio"
                                mode="currency"
                                currency="USD"
                                locale="en-US"
                                :class="{ 'p-invalid': errors.precio }" 
                                :required="true" 
                            />

                            <small class="p-invalid" v-if="errors.precio">{{ errors.precio[0] }}</small>
                        </div>
                        <div class="field col">
                            <label for="txtStock">Stock</label>
                            <InputNumber
                                id="txtStock"
                                v-model="fields.stock"
                                integeronly
                                :class="{ 'p-invalid': errors.stock }"
                                :required="true"
                            />
                            <small class="p-invalid" v-if="errors.stock">{{ errors.stock[0] }}</small>
                        </div>
                    </div>
                   
                    <div class="field">
                        <label for="cbxCategoria">Categoria</label>
                        <Dropdown
                            id="cbxCategoria"
                            v-model="fields.id_categoria"
                            :options="CbxCategoria"
                            filter
                            showClear
                            :virtualScrollerOptions="{ itemSize: 38 }"
                            optionLabel="name"
                            optionValue="code"
                            placeholder="Seleccionar"
                            :class="{ 'p-invalid': errors.id_categoria }"
                        />
                        <small class="p-invalid" v-if="errors.id_categoria">{{ errors.id_categoria[0] }}</small>
                    </div>
            
                    <div class="field">
                        <label for="cbxMarca">Marca</label>
                        <Dropdown
                            id="cbxMarca"
                            v-model="fields.id_marca"
                            :options="CbxMarca"
                            filter
                            showClear
                            optionLabel="name"
                            optionValue="code"
                            dataKey="code"
                            placeholder="Seleccionar"
                            :class="{ 'p-invalid': errors.id_marca }"
                            @change="changeCombo"
                        />
                        <small class="p-invalid" v-if="errors.id_marca">{{ errors.id_marca[0] }}</small>
                    </div>
                    
                    <div class="field">
                        <label class="mb-3">Estado</label>
                        <div class="formgrid grid">
                            <div class="field-radiobutton col-6">
                                <RadioButton
                                    id="category1"
                                    name="category"
                                    value="Accessories"
                                    v-model="fields.activo"
                                />
                                <label for="category1">Activo</label>
                            </div>
                            <div class="field-radiobutton col-6">
                                <RadioButton 
                                    id="category2"
                                    name="category"
                                    value="Clothing"
                                    v-model="fields.activo"
                                />
                                <label for="category2">Inactivo</label>
                            </div>
                        </div>
                    </div>

                    <template #footer>
                        <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                        <Button label="Save" icon="pi pi-check" class="p-button-text" @click="fnGrabar" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteProductDialog" :style="{ width: '450px' }" header="Confirmar" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="fields">Esta seguro que desea eliminar el producto <b>{{ fields.name }}</b>?</span>
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

<style scoped lang="scss"></style>
