<script setup lang="ts">
    import { ref, defineExpose } from 'vue';
    import type Address from '~/api/models/Address';
    import type AddressType from '~/api/models/AddressType';
    import type Locality from '~/api/models/Locality';
    import type Country from '~/api/models/Country';
    //import EntityService from '~/api/services/EntityService';
    import ConfirmDialogue from '@/components/ConfirmDialogue.vue';
    import LocalityFormComponent from '@/components/LocalityFormComponent.vue';
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

        addressTypeOptions: {
            type: Array,
            required: true,
        },
        mode: {
            type: String,
            default: 'create'
        },
        onAddressEvent: {
            type: Function,
            default: () => () => {
                console.log("Aucune fonction n'a été spécifiée dans on-address-event sur le composant : ArticlePopupComponent");
            }
        }
    });

    //onMounted(() => {
    //    console.log("AddressFormComponent is mounted");
    //});

   // const service = new EntityService();
    const addressData = ref<Address>(props.initialData as Address);
   
    const streetName = ref('');
    const streetNumber = ref('');
    const postalBox = ref('');
    const isMainAddress = ref(false);
    const notes = ref('');
  //  const localityId = ref(0);
    const locality: Ref<Locality> = ref<Locality>({ ID: 0, Town: '', ZipCode: '', State: '', ID_Country: 0, Country: { ID: 0, Name: '', CountryCode: '', CanAddLocalities:0 } });
    const countryId = ref(0);
    const state = ref('');
    const zipCode = ref('');

    const addressTypeArr = ref([]);

    const confirmationDialog = ref(null);
    const deleteLocalityConfirmationDialogue = ref(null);

    const isVisible = ref(false);

    const firstLoad = ref(true);

/*    const selectedCountry: Ref<Country> = ref<Country>({ ID: 0, Name: '', CountryCode: '', CanAddLocalities:0 });*/
    const selectedLocalities: Ref<Locality[]> = ref<Locality[]>([]);

    //function arrayFeed takes in address_types array from Address object received for update and feeds the data into intermediary addressTypeArr array 
    //which also has Selected prarameter (boolean) to reflect selected or deselected boxes in template part
    function arrayFeed(selectedArr: AddressType[]) {
        props.addressTypeOptions.forEach((item, index) => addressTypeArr.value[index]={ ID: item.ID, Name: item.Name, Selected: false });
        if (props.mode == 'update') {
            addressTypeArr.value.forEach((item, index) => console.log(index, item));
            for (let i = 0; i < addressTypeArr.value.length; i++) {
                for (let k = 0; k < selectedArr.length; k++) {
                    if (selectedArr[k].ID == addressTypeArr.value[i].ID) {
                        addressTypeArr.value[i].Selected = true;
                        break;
                    }
                }
            }
        }
        console.log("Initial address type array: ", addressTypeArr);
    }

    //function arrayRes converts intermediary addressTypeArr array into array containing only IDs of selected address types, which is then sent as part of POST or PATCH request
    function arrayRes(){
        var arrId: number[] = [];
        addressTypeArr.value.forEach((item, index) => { if (item.Selected) { arrId.push(item.ID); } });
        console.log(arrId);
        return arrId;
    }

    //if a country (or a different country) is selected the list of localities is selected accordingly
    watch(countryId, async (newValue, oldValue) => {
       // console.log("watch selected Country: OLD VALUE -", oldValue);
       // console.log("watch selected Country: NEW VALUE -", newValue);
        if (newValue !== null && newValue !== oldValue && newValue>0) {
            refreshLocalities(newValue);            
        } else {
            // If no country is selected, localities list is set to empty
            selectedLocalities.value = [];
        }
    }, { immediate: true });

    //function refreshLocalities empties the selectedLocalities list and then populated it according to selected country unless this is the first load of country select
    async function refreshLocalities(countryId: number) {
        selectedLocalities.value = [];     
        //  console.log("Refresh localities firstLoad:", firstLoad.value);
        var data = await useAsyncData("localities", () => api.entity.getLocalities(countryId));
        if (!firstLoad.value) {
            locality.value = ({ ID: 0, Town: '', ZipCode: '', State: '', ID_Country: 0, Country: { ID: 0, Name: '', CountryCode: '', CanAddLocalities: 0 } });
        }
        else {
            firstLoad.value = false;
        }
       
        console.log("Refresh localities raw LOCALITIES list:",data.data.value.localities);
        selectedLocalities.value = data.data.value.localities;
       // console.log("Refresh localities SELECTED LOCALITIES value: ", selectedLocalities.value);
       // console.log("Refresh localities selected Locality ID: ", locality.value.ID
    }
    


   

    function closeForm() {
        isVisible.value = false;
        resetInputs();
        console.log("CLOSE FORM firstLoad:", firstLoad.value);
    }

    function closeFormWithoutReset() {
        isVisible.value = false;
    }

    function handleOverlayClick($event) {
        if ($event.target === $event.currentTarget) {
            closeForm();
           
        }
    }

    function resetInputs() {
        streetName.value = '';
        streetNumber.value = '';
        postalBox.value = '';
        isMainAddress.value = false;
        notes.value = '';
       // localityId.value = 0;
        countryId.value = 0;
        locality.value = ({ID: 0, Town: '', ZipCode: '', State: '', ID_Country: 0, Country: { ID: 0, Name:'', CountryCode:'',CanAddLocalities:0 } });
        state.value = '';
        zipCode.value = '';
        firstLoad.value = true;
        addressTypeArr.value.forEach((item) => item.Selected = false);
    }

    function openForm(canUpdate = true) {
        isVisible.value = true;
        const address = addressData.value;
        console.log(props.addressTypeOptions);
        console.log(props.countryOptions);
        console.log("OPEN FORM firstLoad:", firstLoad.value);

        if (props.mode === 'update' && canUpdate) {
            streetName.value = address.StreetName != null ? address.StreetName : '';
            streetNumber.value = address.StreetNumber != null ? address.StreetNumber : '';          
            postalBox.value = address.PostalBox != null ? address.PostalBox : '';
            isMainAddress.value = address.IsMainAddress != null ? address.IsMainAddress : false;
            notes.value = address.Notes != null ? address.Notes : '';          
            state.value = address.locality != null ? address.locality.State : '';
            zipCode.value = address.locality != null ? address.locality.ZipCode : '';         
            locality.value = address.locality != null ? address.locality : locality;
            countryId.value = address.locality != null ? address.locality.country.ID : 0;
           

            console.log("variable populated in AddressFormComponent",              
                streetName.value,
                streetNumber.value,
                postalBox.value,
                isMainAddress.value,
                notes.value,
                state.value,
                zipCode.value,
                locality,
                countryId.value);

            console.log("attributes of addressData",
                addressData.value.locality.ID, addressData.value.locality?.country.ID);
        }
        arrayFeed(address.address_types);
    }

    function setInitialData(newData: Address) {
      //  console.log("AddressFormComponent data SET INITIAL DATA", newData);
      //  console.log("MODE", props.mode);
        addressData.value = newData;   
        firstLoad.value = true;
      //  console.log("AddressFormComponent SET INITIAL DATA addressData", addressData);
    }

    //updating state and zipcode inputs in line with selected locality
    watch(locality, async (newCode, oldCode) => {
       // console.log("locality change", oldCode, newCode);
        if (newCode != oldCode && newCode != null) {
       //     console.log("locality change", oldCode, newCode);
           state.value = newCode.State;
            zipCode.value = newCode.ZipCode;
        }
    }, { immediate: true });

    //function which opens a dialogue window and on positive response evokes a service to create or modify an address
    async function openConfirmationDialog() {        
        const arrId = arrayRes();
        console.log("Resulting address type select: ", arrId);

        confirmationDialog.value.showConfirmation({
                title: 'Confirmation',
                message: props.mode === 'create' ? 'Êtes-vous sûr de vouloir ajouter cette addresse?' : props.mode === 'update' ? 'Êtes-vous sûr de vouloir modifier cette  addresse?' : '',

            yesMessage: props.mode === 'create' ? 'AJOUTER' : props.mode === 'update' ? 'MODIFIER' : '',
           

                confirmCallback: async () => {
                    if (props.mode === 'create') {
                        const response = await api.entity.createAddress(
                            locality.value.ID,
                            addressData.value.ID_Entity,
                            streetName.value,
                            streetNumber.value,
                            postalBox.value,
                            notes.value,
                            isMainAddress.value, 
                            arrId
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
                                props.onAddressEvent();
                                closeForm();
                            }
                        }
                        props.onAddressEvent();
                        closeForm();
                    }
                    else if (props.mode === 'update') {
                        console.log("Update request DATA", addressData.value.ID, title.value, locality.value.ID, addressData.value.ID_Entity, streetName.value, streetNumber.value, postalBox.value, notes.value, isMainAddress.value);
                        try {
                            const response = await api.entity.updateAddress(
                                addressData.value.ID,                               
                                locality.value.ID,
                                addressData.value.ID_Entity,
                                streetName.value,
                                streetNumber.value,
                                postalBox.value,
                                notes.value,
                                isMainAddress.value,
                                arrId
                            );
                            console.log("UPDATE response", response);
                            if (response.code != 1) {
                                showNotification({
                                    title: response.header,
                                    message: response.message,
                                    code: response.code
                                });
                                props.onAddressEvent();
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
                                    props.onAddressEvent();
                                    closeForm();
                                }
                                props.onAddressEvent();
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
    //exposing methods to parent component, in this case entities.vue page.
    defineExpose({ openForm, closeForm, setInitialData });

   
    //===========================================================================================================================================================//
    // LOCALITY: Variable and functions required for performing CRUD operations on Localities
    //===========================================================================================================================================================//

    //variables - refs for pop-up elements for addding new telephones or updating selected telephone
    const createLocalityFormComponent: Ref<LocalityFormComponent> = ref<LocalityFormComponent>(null);
    const updateLocalityFormComponent: Ref<LocalityFormComponent> = ref<LocalityFormComponent>(null);

    //what happens when IntTelDialCode pop-up closes
    async function onLocalityAdd() {
        openForm();
        await refreshLocalities(countryId.value);
    };

    //display component to add Locality
    function showCreateLocalityFormComponent() {
        closeFormWithoutReset();
        var blankLocality: Locality = ({
            'ID': 0,
            'ZipCode': '',
            'Town': '',
            'State': '',
            'ID_Country': 0,
            'Country': ({ 'ID': countryId.value, 'Name':'', 'CountryCode':'', 'CanAddLocalities':0}) as Country
        }) as Locality;
       // console.log("Locality to be created", blankLocality);
        createLocalityFormComponent.value.setInitialData(blankLocality);
        createLocalityFormComponent.value.openForm();
    }

    //display component to update Locality
    function showUpdateLocalityFormComponent(locality: Locality) {
        closeFormWithoutReset();
    //    console.log("Locality to be UPDATED", locality);
        updateLocalityFormComponent.value.setInitialData(locality);
        updateLocalityFormComponent.value.openForm();

    }

    //delete Locality
    async function OnDeleteLocalityConfirmationDialogue(id: number) {
        console.log("open delete confirmation dialogue", id);

        deleteLocalityConfirmationDialogue.value.showConfirmation({
            title: 'Confirmation de suppression',
            message: 'Êtes-vous sûr de vouloir supprimer cette localité?',
            yesMessage: 'SUPPRIMER',

            confirmCallback: async () => {
                try {
                    const response = await api.entity.deleteLocality(id);
                    if (response.code != 1) {
                        showNotification({
                            title: response.header,
                            message: response.message,
                            code: response.code
                        });
                        await refreshLocalities(countryId.value)
                    }
                    else {
                        showNotification({
                            title: response.header,
                            message: response.message,
                             actionMessage: "Suppression non effectuée",
                            code: response.code,
                            duration: 4500
                        });
                        await refreshLocalities(countryId.value)

                        if (response.code === 1) {
                            //showEmails(selectedAddress.value.ID);
                        }
                        await refreshLocalities(countryId.value)
                    }
                } catch (err) {
                    showNotification({
                        title: "Erreur critique",
                        message: err.message || "Erreur lors de la suppression de localité.",
                         actionMessage: "Suppression non effectuée",
                        code: 4
                    });
                }
            },
            cancelCallback: () => { },
        });
    }
    //function to reflect selection/deselction of address types in an addressType array
    function typeChecked(id:number) {
       // console.log(id);
        addressTypeArr.value.forEach((item) => { if (item.ID == id) { item.Selected = !item.Selected; } });
       // console.log(addressTypeArr.value);
    }

</script>

<template>
    <!--Component for confirming the user's choice-->
    <ConfirmDialogue ref="confirmationDialog" />
    <ConfirmDialogue ref="deleteLocalityConfirmationDialogue" />
    <LocalityFormComponent ref="createLocalityFormComponent" mode="create" :countryOptions="props.countryOptions"  :on-locality-cancel="openForm" :on-locality-add="onLocalityAdd" />
    <LocalityFormComponent ref="updateLocalityFormComponent" mode="update" :countryOptions="props.countryOptions"  :on-locality-cancel="openForm" :on-locality-add="onLocalityAdd" />

    <div v-if="isVisible" class="popup-overlay" @click.self="closeForm">

        <div class="bg-b7 b-b3 br-5 p-10 w-70" @click.stop>
            <!--FORM for adding/editing new ADDRESS details-->
            <form class="w-full flex-c a-center" @submit.prevent="openConfirmationDialog">
                <div class="ta-center fw-bold c-b4 f-1">
                    {{ props.mode === 'create' ? "Ajouter une addresse" : props.mode === 'update' ? "Modifier une addresse" : ""}}
                </div>
               
                <div class="flex-c a-top bg-t j-top w-full  mb-2">                   
                    <div class="flex-r j-top w-full mb-2 bg-t">
                        <!--Section for selecting/updating TITLE-->
                        <div class="f-3 flex-c a-top bg-t mb-2">
                            <label for="title" class="w-full detail-label ml-5">TYPE (plusieurs peuvent être sélectionnés)*</label>                            
                            <div class="f-3 flex-r a-top " id="title" v-for="(type, index) in addressTypeArr" :key="`entry-${type.ID}`">
                                <input type="checkbox" value="type.ID" v-bind:checked="type.Selected" @change="typeChecked(type.ID)">
                                <label class="detail-label  ml-2">{{type.Name}}</label><br>
                            </div>
                            <!--<select class="detail-input w-70 ta-top"
            v-model="title"
            required>
        <option v-for="(item, key) in titles" :value="item.ID">
            {{item.Name}}
        </option>
    </select>-->
                        </div>
                        <!--Section for selecting/updating MAIN ADDRESS status-->
                        <div class="f-2 flex-c a-center j-center bg-t mb-2 ml-2">
                            <label for="isMainAddress" class="w-auto detail-label ml-5">ADDRESSE PRINCIPAL</label>
                            <input class="detail-input " id="isMainAddress" type='checkbox' v-model="isMainAddress" />
                        </div>
                    </div>

                        <!--Section for selecting/updating COUNTRY-->                      
                        <div class="f-3 w-50 flex-c a-top bg-t mb-2">
                            <label for="country" class="w-full detail-label ml-5">PAYS*</label>
                            <select class="detail-input w-70 ta-top"
                                    v-model="countryId"
                                    required>                                
                                <option v-if="countryId==0" :value="countryId" disabled> Choisir pays ...</option>
                                <option v-for="(item, key) in props.countryOptions" :value="item.ID">
                                    {{item.Name}}
                                </option>
                            </select>
                        </div>

                        <!--Section for selecting/updating LOCALITY-->
                        <div v-if="countryId>0" class="flex-r j-top w-full mb-2 bg-t">
                            <!--Section for selecting/updating TOWN-->
                            <div class="f-4 flex-c bg-t ">
                                <label for="town" class="w-full detail-label ml-5">LOCALITÉ*</label>
                                <select class="w-full detail-input mb-2 pl-2 ta-justify"
                                        v-model="locality"
                                        required>
                                    
                                    <option v-if="locality.ID==0" :value="locality" disabled>Choisir nom de la localité ...</option>
                                    <option v-for="(item, key) in selectedLocalities" :value="item">
                                        {{item.ZipCode}}     {{item.Town}}
                                    </option>
                                </select>
                            </div>
                            <!--Section for ZIPCODE-->
                            <div class="f-2 flex-c a-top bg-t ml-2">
                                <label for="zipCode" class="w-full detail-label ml-5">CODE POSTAL*</label>
                                <input v-if="locality.ID==0" class="detail-input w-full ta-top" id="zipCode" value='-' placeholder="Division administrative..." required disabled />
                                <input v-else class="detail-input w-full ta-top" id="zipcode" v-model="zipCode" placeholder="Code postal..." required disabled />
                            </div>
                            <!--Section for STATE-->
                            <div class="f-4 flex-c a-top bg-t ml-2">
                                <label for="state" class="w-full detail-label ml-5">DIVISION ADMINISTRATIVE (p.ex. canton)*</label>
                                <!--<input v-if="locality.ID==0" class="detail-input w-full ta-top" id="state" value='state' placeholder="Division administrative..." required disabled />-->
                                <input class="detail-input w-full ta-top" id="state" v-model="state" placeholder="Division administrative..." required disabled />
                            </div>
                            <!--Button section for adding/updating LOCALITIES !! unless they are in Switzerland !!! -->
                            <div v-if="countryId!=177" class="f-3 flex-r a-center j-center w-full bg-t ml-2">
                                <button class="tiny-button w-10 h-auto flex-r j-center a-center" type="button" @click="showUpdateLocalityFormComponent(locality)" title="Editer la localité sélectionnée">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                                    </svg>
                                </button>
                                <button class="tiny-button w-10 h-auto flex-r j-center a-center ml-2" type="button" @click="OnDeleteLocalityConfirmationDialogue(locality.ID)" title="Supprimer l'indicatif sélectionné">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                    </svg>
                                </button>
                                <button class="tiny-button  w-10 h-auto flex-r j-center a-center ml-2" type="button" @click="showCreateLocalityFormComponent()" title="Ajouter une nouvelle localité">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 25 25" stroke-width="1.5" stroke="currentColor" class="size-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div v-if="locality.ID>0" class="flex-r j-top w-full mb-2">
                            <!--Section for adding/updating Street Name-->
                            <div class="f-3 flex-c bg-t">
                                <label for="streetName" class="w-full detail-label ml-5">CHEMIN*</label>
                                <input class="detail-input w-full ta-top" id="streetName" v-model="streetName" placeholder="Chemin..." required />
                            </div>
                            <!--Section for adding/updating House number-->
                            <div class="f-3 flex-c a-top bg-t">
                                <label for="streetNumber" class="w-full detail-label ml-5">NUMÉRO DE BÂTIMENT*</label>
                                <input class="detail-input w-full ta-top" id="streetNumber" v-model="streetNumber" placeholder="Numéro de bâtiment..." required />
                            </div>
                            <!--Section for adding/updating Postal Box if neccesary-->
                            <div class="f-3 flex-c a-top bg-t">
                                <label for="postalBox" class="w-full detail-label ml-5">BÔITE POSTALE</label>
                                <input class="detail-input w-full ta-top" id="postalBox" v-model="postalBox" placeholder="Boîte postale..." />
                            </div>
                        </div>
                        <!--Section for adding/updating Notes if neccesary-->
                        <div class="f-3 flex-c bg-t mb-2 w-full">
                            <label for="notes" class="w-full detail-label ml-5">REMARQUES</label>
                            <textarea class="detail-input w-full ta-top" id="notes" v-model="notes" placeholder="Remarques..." />
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