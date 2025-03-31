<script setup lang="ts">
    import { ref, defineExpose } from 'vue';
    import type Email from '~/api/models/Email';   
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
        mode: {
            type: String,
            default: 'create'
        },
        onEmailEvent: {
            type: Function,
            default: () => () => {
                console.log("Aucune fonction n'a été spécifiée dans on-article-event sur le composant : TelephoneFormComponent");
            }
        }
    });

    //onMounted(() => {
    //    console.log("TelephoneFormComponent is mounted");
    //});

   // const service = new SimpleEntityService();
    const emailData = ref<Email>(props.initialData as Email);
    const Name = ref('');
    const confirmationDialog = ref(null);
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
        Name.value = '';
    }

    async function openForm(canUpdate = true) {
        isVisible.value = true;
        const email = emailData.value;

        if (props.mode === 'update' && canUpdate) {
            Name.value = email.Name;            
        }
    }

    function setInitialData(newData: Email) {
      //  console.log("EmailFormComponent data SET INITIAL DATA", newData);
        emailData.value.ID = newData.ID;
        emailData.value.ID_AT_EntityAddress = newData.ID_AT_EntityAddress;
        emailData.value.Name = newData.Name;
      //  console.log("Email Data",emailData.value);
    }

   
   
    async function openConfirmationDialog() {
        console.log("Data prior to be submitted", emailData.value);

        confirmationDialog.value.showConfirmation({
            title: 'Confirmation',

            message: props.mode === 'create' ? 'Êtes-vous sûr de vouloir ajouter cet email ?' : props.mode === 'update' ? 'Êtes-vous sûr de vouloir modifier cet email ?' : '',

            yesMessage: props.mode === 'create' ? 'AJOUTER' : props.mode === 'update' ? 'MODIFIER' : '',

            confirmCallback: async () => {
                if (props.mode === 'create') {
                    const response = await api.entity.createEmail(
                        Name.value,
                        emailData.value.ID_AT_EntityAddress,
                    );
                    console.log("CREATE response", response);
                    console.log("CREATE response code", response.code);

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
                            code: response.code,
                            actionMessage: "Ajout non effectué",
                            duration: 4500
                        });

                        if (response.code === 1) {
                            props.onEmailEvent();
                            closeForm();
                        }
                    }
                    props.onEmailEvent();
                    closeForm(); 
                }
                else if (props.mode === 'update') {
                    try {
                        const response = await api.entity.updateEmail(
                            emailData.value.ID,
                            Name.value,
                            emailData.value.ID_AT_EntityAddress
                        );
                        console.log("UPDATE response", response);

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
                                actionMessage: "Modiciation non effectuée",
                                code: response.code,
                                duration: 4500
                            });

                            if (response.code === 1) {
                                props.onEmailEvent();
                                closeForm();                               
                            }
                            props.onEmailEvent();
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

        <div class="bg-b7 b-b3 br-5 p-10" @click.stop>
            <!--FORM for adding/editing new details-->
            <form class="w-100 flex-c a-center" @submit.prevent="openConfirmationDialog">
                <div class="ta-center fw-bold c-b4 f-1">
                    {{ props.mode === 'create' ? "Ajouter un email" : props.mode === 'update' ? "Modifier un email" : ""}}
                </div>
                <!--Form section for entering new email-->
                <div class="w-full flex-c a-top j-top bg-t mb-2">
                    <div class="flex-c a-top w-full bg-t">
                        <label for="title" class="w-full detail-label ml-5">Email*</label>
                        <input class="detail-input w-full ta-top" id="name" v-model="Name" placeholder="Email..." required />
                    </div>
                </div>
                <!--button section for closing the form or accepting changes-->
                <div class="flex-r j-space-between">
                    <button class="tiny-button  h-full w-40 flex-r j-center a-center c-b4 m-auto" type="submit">
                        {{props.mode === 'create' ? "AJOUTER" : props.mode ==='update' ? "MODIFIER" : ""}}
                    </button>

                    <div class="w-10"></div>
                    <button class="tiny-button h-full w-40 flex-r j-center a-center c-b4 m-auto" type="button" @click="closeForm" title="Enregistrer les modifications">ANNULER</button>
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