<script setup lang="ts">
    import { ref, defineExpose } from 'vue';
    import type Telephone from '~/api/models/Telephone';
    import type TelephoneType from '~/api/models/TelephoneType';
    import type IntTelDialCode from '~/api/models/IntTelDialCode';
    //import { SimpleEntityService } from '~/api/services/EntityService';    
    import ConfirmDialogue from '@/components/ConfirmDialogue.vue';
    import IntTelDialCodeFormComponent from '@/components/IntTelDialCodeFormComponent.vue';

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
        onTelephoneEvent: {
            type: Function,
            default: () => () => {
                console.log("Aucune fonction n'a été spécifiée dans on-article-event sur le composant : ArticlePopupComponent");
            }
        }
    });

    //onMounted(() => {
    //    console.log("TelephoneFormComponent is mounted");
    //});

    //const service = new SimpleEntityService();

    const {
        data: telephoneTypes,
        pending: pendingTelephoneTypes,
        error: errorTelephoneTypes,
        refresh: refreshTelephoneTypes
    } = await useAsyncData("entity/telephoneTypes", async () => {
        var tempData = await api.entity.getTelephoneTypes();
        console.log("elephone Form Component: telephone types", tempData.telephoneTypes);
        return tempData.telephoneTypes;
    });

    const {
        data: intTelDialCodes,
        pending: pendingIntTelDialCodes,
        error: errorIntTelDialCodes,
        refresh: refreshIntTelDialCodes
    } = await useAsyncData("entity/intTelDialCodes", async () => {
        var tempData = await api.entity.getIntTelDialCode();
        console.log("Telephone Form Component: IntTelDialCodes", tempData.codes);
        return tempData.codes;
    });

    const telephoneData = ref<Telephone>(props.initialData as Telephone);

    const phoneNumber = ref('');
    const notes = ref('');
    const id_AT_EntityAddress = ref(0);
    const telephoneType: Ref<TelephoneType> = ref<TelephoneType>({ ID: 0, Name: '' });
    const intTelDialCode: Ref<IntTelDialCode> = ref<IntTelDialCode>({ ID: 0, Code: 0, Regex: '', ID_Country: 0, Country: { ID: 0, Name: '', CountryCode: '', CanAddLocalities:0 } });
    const regExString = ref('');

    const confirmationDialog = ref(null);
    const deleteCodeConfirmationDialogue = ref(null);

    const phoneNumberLong = ref(false);
    const phoneNumberIncorrect = ref(false);

    const isVisible = ref(false);

    function closeForm() {
        isVisible.value = false;
        resetInputs();
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
        phoneNumber.value = '';
        notes.value = '';
        id_AT_EntityAddress.value = 0;
        telephoneType.value = ({ ID: 0, Name: '' });
        intTelDialCode.value = ({ ID: 0, Code: 0, Regex: '', ID_Country: 0, Country: { ID: 0, Name: '', CountryCode: '', CanAddLocalities: 0 } });
        regExString.value = '';
        phoneNumberLong.value = false;
        phoneNumberIncorrect.value = false;
    }

    async function openForm(canUpdate = true) {
        isVisible.value = true;
        const telephone = telephoneData.value;

        if (props.mode === 'update' && canUpdate) {
            phoneNumber.value = telephone.PhoneNumber;
            notes.value = telephone.Notes;
            intTelDialCode.value = telephone.international_code;            
            telephoneType.value = telephone.telephone_type;            
        }
       // console.log("OPEN TELEPHONE FORM: Code:", intTelDialCode.value);
       // console.log("OPEN TELEPHONE FORM: Type:", telephoneType.value);

    }

    function setInitialData(newData: Telephone) {
        console.log("TelephoneFormComponent data SET INITIAL DATA", newData);
        telephoneData.value = newData;
    }

    function regExToX(regexStr: string): string {
       // console.log("regExToX function in Telephones")
      //  console.log(regexStr);
        const arr1 = regexStr.split("(\\d{");
      //  console.log(arr1);

        var arr2 = Array();
        var resStr = '';
        arr1.forEach((item, index) => arr2[index] = item.replace(/\D/g, ''));
        arr2.forEach((item) => resStr = resStr + 'X'.repeat(item.length > 0 ? Number(item) : 0) + ' ');    
        return resStr;
    }

    watch(intTelDialCode, async (newCode, oldCode) => {
        if (newCode != oldCode && newCode != null) {
            regExString.value = regExToX(newCode.Regex);
        }
    }, { immediate: true });
   
    async function openConfirmationDialog() {
        console.log("Data prior to be submitted", phoneNumberIncorrect.value, phoneNumberLong.value, telephoneData.value);
       
        if (!phoneNumberIncorrect.value && !phoneNumberLong.value) {
            confirmationDialog.value.showConfirmation({
                title: 'Confirmation',

                message: props.mode === 'create' ? 'Êtes-vous sûr de vouloir ajouter ce téléphone ?' : props.mode === 'update' ? 'Êtes-vous sûr de vouloir modifier ce téléphone ?' : '',

                yesMessage: props.mode === 'create' ? 'AJOUTER' : props.mode === 'update' ? 'MODIFIER' : '',

                confirmCallback: async () => {
                    if (props.mode === 'create') {
                        const response = await api.entity.createTelephone(
                            phoneNumber.value,
                            telephoneType.value.ID,
                            intTelDialCode.value.ID,
                            notes.value,
                            telephoneData.value.ID_AT_EntityAddress,
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
                                props.onTelephoneEvent();
                                closeForm();
                            }
                        }
                        props.onTelephoneEvent();
                        closeForm();
                    }
                    else if (props.mode === 'update') {
                        try {
                            const response = await api.entity.updateTelephone(
                                telephoneData.value.ID,
                                phoneNumber.value,
                                telephoneType.value.ID,
                                intTelDialCode.value.ID,
                                notes.value,
                                telephoneData.value.ID_AT_EntityAddress,
                            );
                            console.log("UPDATE response", response);
                            if (response.code != 1) {
                                showNotification({
                                    title: response.header,
                                    message: response.message,
                                    code: response.code
                                });
                                props.onTelephoneEvent();
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
                                    props.onTelephoneEvent();
                                    closeForm();
                                }        
                                props.onTelephoneEvent();
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
    }

    defineExpose({ openForm, closeForm, setInitialData });

    function phoneFilter(event) {
        const re = new RegExp(intTelDialCode.value.Regex);
        var inputText = event.target.value;
        console.log(intTelDialCode.value.Regex, re.test(inputText));
        
        if (!re.test(inputText)) {
            phoneNumberLong.value = true;
        }
        else {
            phoneNumberLong.value = false;
            if (inputText.charCodeAt(inputText.length - 1) < 48 || inputText.charCodeAt(inputText.length - 1) > 57) {
                phoneNumberIncorrect.value = true;
            }
            else {
                phoneNumberIncorrect.value = false;
            }
        } 
    }

    //===========================================================================================================================================================//
    // INT-TEL-DIAL-CODE: Variable and functions required for performing CRUD operations on IntTelDialCodes 
    //===========================================================================================================================================================//

    //variables - refs for pop-up elements for addding new telephones or updating selected telephone
    const createIntTelDialCodeFormComponent: Ref<IntTelDialCodeFormComponent> = ref<IntTelDialCodeFormComponent>(null);
    const updateIntTelDialCodeFormComponent: Ref<IntTelDialCodeFormComponent> = ref<IntTelDialCodeFormComponent>(null);

    //what happens when IntTelDialCode pop-up closes
    async function onIntTelDialCodeAdd() {
        openForm()
        await refreshIntTelDialCodes();
    };

    //display component to add IntTelDialCode
    function showCreateIntTelDialCodeFormComponent() {
        closeFormWithoutReset();
        createIntTelDialCodeFormComponent.value.openForm();
    }

    //display component to update IntTelDialCode   
    function showUpdateIntTelDialCodeFormComponent(intTelDialCode: IntTelDialCode) {
        closeFormWithoutReset();
       // console.log("IntTelDialCode to be UPDATED", intTelDialCode);       
        updateIntTelDialCodeFormComponent.value.setInitialData(intTelDialCode);
        updateIntTelDialCodeFormComponent.value.openForm();

    }

    //delete IntTelDialCode
    
    async function onDeleteCodeConfirmationDialogue(id: number) {
        console.log("open delete confirmation dialogue", id);

        deleteCodeConfirmationDialogue.value.showConfirmation({
            title: 'Confirmation de suppression',
            message: 'Êtes-vous sûr de vouloir supprimer cet indicatif téléphonique international?',
            yesMessage: 'SUPPRIMER',

            confirmCallback: async () => {
                try
                {
                    const response = await service.deleteIntTelDialCode(id);
                    if (response.code != 1) {
                        showNotification({
                            title: response.header,
                            message: response.message,
                            code: response.code
                        });
                        refreshIntTelDialCodes();
                    }
                    else {
                        showNotification({
                            title: response.header,
                            message: response.message,
                            actionMessage: "Suppresion non effectuée",
                            code: response.code,
                            duration: 4500
                        });

                        if (response.code === 1) {
                            refreshIntTelDialCodes();
                        }
                        refreshIntTelDialCodes();
                    }
                } catch (err) {
                    showNotification({
                        title: "Erreur critique",
                        message: err.message || "Erreur lors de la suppression de l'article.",
                         actionMessage: "Suppresion non effectuée",
                        code: 4
                    });
                }
            },
            cancelCallback: () => { },
        });        
    }

</script>

<template>
    <!--Component for confirming the user's choice-->
    <ConfirmDialogue ref="confirmationDialog" />
    <ConfirmDialogue ref="deleteCodeConfirmationDialogue" />
    <IntTelDialCodeFormComponent ref="createIntTelDialCodeFormComponent" mode="create" :countryOptions="props.countryOptions" :on-code-cancel="openForm" :on-code-add="onIntTelDialCodeAdd"/>
    <IntTelDialCodeFormComponent ref="updateIntTelDialCodeFormComponent" mode="update" :countryOptions="props.countryOptions" :on-code-cancel="openForm" :on-code-add="onIntTelDialCodeAdd"/>

    <div v-if="isVisible" class="popup-overlay" @click.self="closeForm">

        <div class="bg-b7 b-b3 br-5 p-10 w-70" @click.stop>
            <!--FORM for adding/editing new details-->
            <form class="w-full flex-c a-center" @submit.prevent="openConfirmationDialog">
                <div class="ta-center fw-bold c-b4 f-1">
                    {{ props.mode === 'create' ? "Ajouter un téléphone" : props.mode === 'update' ? "Modifier un téléphone" : ""}}
                </div>

                <!--Form section for entering new telephone-->
                <div class="flex-r a-top bg-t j-center w-full  mb-2">
                    <!--Section for selecting/updating telephone type-->
                    <div class="f-5 flex-c a-top bg-t">
                        <label for="title" class="w-full detail-label ml-5">Téléphone type*</label>
                        <select class="detail-input w-70 ta-top"
                                v-model="telephoneType"
                                required>
                            <option v-if="telephoneType.ID==0" :value="telephoneType" disabled>Choisir type du téléphone...</option>
                            <option v-for="(item, key) in telephoneTypes" :value="item">
                                {{item.Name}}
                            </option>
                        </select>
                    </div>
                    <!--Section for selecting/updating telephone code-->
                    <div class="f-5 flex-c bg-t ml-2">
                        <label for="title" class="w-full detail-label ml-5">Indicatif téléphonique international*</label>                       
                        <select class="w-full detail-input mb-2 ta-top pl-2"
                                v-model="intTelDialCode"
                                required>                            
                            <option v-if="intTelDialCode.ID==0"  :value="intTelDialCode" disabled>Choisir indicatif téléphonique...</option>
                            <option v-for="(item, key) in intTelDialCodes" :value="item">
                                {{item.Code}}
                            </option>
                        </select>
                        <div class="flex-r a-top w-full bg-t">
                            <button class="tiny-button w-10 h-auto flex-r j-center a-center" type="button" @click="showUpdateIntTelDialCodeFormComponent(intTelDialCode)" title="Editer l'indicatif sélectionné">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">


                                    <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                                </svg>
                            </button>
                            <button class="tiny-button w-10 h-auto flex-r j-center a-center" type="button" @click="onDeleteCodeConfirmationDialogue(intTelDialCode.ID)" title="Supprimer l'indicatif sélectionné">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                            </button>
                            <button class="tiny-button  w-10 h-auto flex-r j-center a-center " type="button"  @click="showCreateIntTelDialCodeFormComponent()" title="Ajouter un nouvel indicatif téléphonique">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 25 25" stroke-width="1.5" stroke="currentColor" class="size-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                </svg>
                            </button>
                        </div>
                       
                    </div>
                    <!--Section for selecting/updating telephone number-->
                    <div class="f-4 flex-c  bg-t ml-2">
                        <label for="title" class="w-full detail-label ml-5">Numero de Téléphone*</label>
                        <input class="detail-input w-full ta-top"
                               :class="{'validation-alert':phoneNumberIncorrect ||phoneNumberLong}"
                               id="phoneNumber"
                               v-model="phoneNumber"
                               placeholder="Phone number..."
                               required
                               @input="phoneFilter" />
                        <p class="detail-label c-b4">Phone number format: {{regExString}}</p>
                        <p v-if="phoneNumberIncorrect" class="detail-label c-red fw-bold">Le numéro de téléphone ne doit contenir que des chiffres</p>
                        <p v-if="phoneNumberLong" class="detail-label c-red fw-bold">Le numéro de téléphone est d'une longueur incorrecte</p>
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