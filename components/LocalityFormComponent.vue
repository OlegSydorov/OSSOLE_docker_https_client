<script setup lang="ts">
    import { ref, defineExpose } from 'vue';
    import type Locality from '~/api/models/Locality';
    import type Country from '~/api/models/Country';    
   // import { SimpleEntityService } from '~/api/services/EntityService';    
    import ConfirmDialogue from '@/components/ConfirmDialogue.vue';

    import { showNotification } from '@/utils/notificationService';

    import { useApi } from '~/api/composables/useApi';
    const api = useApi();

    const props = defineProps({
        initialData: {
            type: Object,
            default: () => ({})
        },
        countryOptions: {
            type: Array,
            required: true,
        },

        mode: {
            type: String,
            default: 'create'
        },

        onLocalityCancel: {
            type: Function,
            default: () => () => {
                console.log("Aucune fonction n'a été spécifiée dans on-LocalityC-cancel sur le composant : LocalityFormComponent");
            }
    },

        onLocalityAdd: {
            type: Function,
            default: () => () => {
                console.log("Aucune fonction n'a été spécifiée dans on-LocalityC-add sur le composant : LocalityFormComponent");
            }
        }
    });

    //onMounted(() => {
    //    console.log("LocalityFormComponent is mounted");
    //});

   // const service = new SimpleEntityService();
    const localityData = ref<Locality>(props.initialData as Locality);

    const town = ref('');
    const zipCode = ref('');
    const countryId=ref(0);
    const state = ref('');

    const confirmationDialog = ref(null);

    const isVisible = ref(false);

    function closeForm() {
        isVisible.value = false;
        props.onLocalityCancel();
    }

    function handleOverlayClick($event) {
        if ($event.target === $event.currentTarget) {
            closeForm();
        }
    }

    function resetInputs() {
        town.value = '';
        zipCode.value = '';
        state.value = '';
        countryId.value=0;
    }

    async function openForm(canUpdate = true) {
        isVisible.value = true;
        if (props.mode === 'update' && canUpdate) {
            const locality = localityData.value;

            town.value = locality.Town;
            zipCode.value = locality.ZipCode;
            state.value = locality.State;
            countryId.value = locality.country.ID;            
        }
        else if (props.mode === 'create' && canUpdate) {
            const locality = localityData.value;
            countryId.value = locality.Country.ID;
        }
      //  console.log("OPEN LOCALITY FORM country=",countryId);
      //  console.log("OPEN LOCALITY FORM country.value=", countryId.value);
       
    }

    function setInitialData(newData: Locality) {
      //  console.log("LocalityFormComponent data SET INITIAL DATA", newData);
        localityData.value= newData;
      //  console.log(localityData.value);
    }

    async function openConfirmationDialog() {
        confirmationDialog.value.showConfirmation({
                title: 'Confirmation',
                message: props.mode === 'create' ? 'Êtes-vous sûr de vouloir ajouter cette localité?' : props.mode === 'update' ? 'Êtes-vous sûr de vouloir modifier cette localité?' : '',

                yesMessage: props.mode === 'create' ? 'AJOUTER' : props.mode === 'update' ? 'MODIFIER' : '',

                confirmCallback: async () => {
                    if (props.mode === 'create') {
                        const response = await api.entity.createLocality(
                            zipCode.value,
                            town.value,
                            state.value,
                            countryId.value,
                        );
                        console.log("CREATE response", response);
                        if (response.code != 1) {
                            showNotification({
                                title: response.header,
                                message: response.message,
                                code: response.code
                            });
                        } else {
                            showNotification({
                                title: response.header,
                                message: response.message,
                                 actionMessage: "Ajout non effectué",
                                code: response.code,
                                duration: 4500
                            });

                            if (response.code === 1) {
                                props.onLocalityAdd();
                                closeForm();
                            }
                        }
                        props.onLocalityAdd();
                        closeForm();
                    }
                    else if (props.mode === 'update') {
                        try {
                            const response = await api.entity.updateLocality(
                               localityData.value.ID,
                               zipCode.value,                               
                               town.value,                               
                               state.value,
                            );
                            console.log("UPDATE response", response);
                            if (response.code != 1) {
                                showNotification({
                                    title: response.header,
                                    message: response.message,
                                    code: response.code
                                });
                                props.onLocalityAdd();
                                closeForm();
                            } else {

                                showNotification({
                                    title: response.header,
                                    message: response.message,
                                     actionMessage: "Modiciation non effectuée",
                                    code: response.code,
                                    duration: 4500
                                });

                                if (response.code === 1) {
                                    props.onLocalityAdd();
                                    closeForm();
                                }
                                props.onLocalityAdd();
                                closeForm();
                            }
                        } catch (err) {
                            showNotification({
                                title: "Erreur critique",
                                message: err,
                                 actionMessage: "Modiciation non effectuée",
                                code: 4,
                                duration: 8000
                            });
                        }
                    }
                },
                cancelCallback: () => { }
        });
    }      
    
    defineExpose({ openForm, closeForm, setInitialData });

</script>

<template>
    <!--Component for confirming the user's choice-->
    <ConfirmDialogue ref="confirmationDialog" />

    <div v-if="isVisible" class="popup-overlay" @click.self="closeForm">

        <div class="bg-b7 b-b3 br-5 p-10 w-70" @click.stop>
            <!--FORM for adding/editing new details-->
            <form class="w-full flex-c a-center" @submit.prevent="openConfirmationDialog">
                <div class="ta-center fw-bold c-b4 f-1">
                    {{ props.mode === 'create' ? "Ajouter une localité" : props.mode === 'update' ? "Modifier une localité" : ""}}
                </div>

                <!--Form section for entering new LOCALITY-->
                <div class="flex-r a-top bg-t j-center w-full  mb-2">
                    <!--Section for selecting/updating COUNTRY-->
                    <div class="f-3 flex-c a-top bg-t">
                        <label for="country" class="w-full detail-label ml-5">PAYS*</label>
                        <select class="detail-input w-full ta-top"
                                id="country"
                                v-model="countryId"
                                required>
                            <option v-if="countryId==0" :value="country" disabled>- </option>
                            <option v-for="(item, key) in props.countryOptions" :value="item.ID">
                                {{item.Name}}
                            </option>
                        </select>
                    </div>
                    <!--Section for selecting/updating TOWN-->
                    <div class="f-3 flex-c bg-t ml-2">
                        <label for="town" class="w-full detail-label ml-5">VILLE/VILLAGE*</label>
                        <input class="detail-input w-full ta-top" id="town" v-model="town" placeholder="Nom de ville/village..." required />
                    </div>
                    <!--Section for selecting/updating STATE-->
                    <div class="f-4 flex-c  bg-t ml-2">
                        <label for="state" class="w-full detail-label ml-5">DIVISION ADMINISTRATIVE (p.ex canton)*</label>
                        <input class="detail-input w-full ta-top" id="state" v-model="state" placeholder="Division administrative..." required />
                    </div>
                    <!--Section for selecting/updating ZIPCODE-->
                    <div class="f-4 flex-c  bg-t ml-2">
                        <label for="zipCode" class="w-full detail-label ml-5">CODE POSTAL*</label>
                        <input class="detail-input w-full ta-top" id="zipCode" v-model="zipCode" placeholder="Code postal..." required />
                    </div>
                </div>

                <!--button section for closing the form or accepting changes-->
                <div class="flex-r j-space-between">
                    <button class="tiny-button  h-full w-40 flex-r j-center a-center c-b4 m-auto" type="submit" title="Enregistrer les modifications">
                        {{props.mode === 'create' ? "AJOUTER" : props.mode ==='update' ? "MODIFIER" : ""}}
                    </button>

                    <div class="w-10"></div>
                    <button class="tiny-button h-full w-40 flex-r j-center a-center c-b4 m-auto" type="button" @click="closeForm" title="Annuler et fermer le forme">ANNULER</button>
                </div>
            </form>
        </div>
    </div>
</template>

<style scoped>
    .popup-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }  

</style>