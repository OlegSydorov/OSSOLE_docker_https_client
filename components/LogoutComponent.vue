<script setup lang="ts">
    import { ref, defineExpose } from 'vue';
    import type AuthUser from '~/api/models/AuthUser';


    const props = defineProps({
        initialData: {
            type: Object,
            default: () => ({})
        },
        onLogoutEvent: {
            type: Function,
            default: () => () => {
                console.log("Aucune fonction n'a été spécifiée dans onLogoutEvent sur le composant : LogoutComponent");
            }
        }
    });

    //onMounted(() => {
    //    console.log("TelephoneFormComponent is mounted");
    //});

   
    const userData = ref<AuthUser>(props.initialData as AuthUser);
    const userRole = ref('unknown');
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
        
    }

    async function openForm(canUpdate = true) {
        isVisible.value = true;
        const user = userData.value;

        console.log("OPEN user form :", user);

    }

    function setInitialData(newData: AuthUser, roleName:string) {
        console.log("LogoutComponent data SET INITIAL DATA", newData);
        userData.value = newData;
        userRole.value = roleName;
    }    
   
    //async function openConfirmationDialog() {
    //    console.log("Data prior to be submitted", phoneNumberIncorrect.value, phoneNumberLong.value, telephoneData.value);
       
    //    if (!phoneNumberIncorrect.value && !phoneNumberLong.value) {
    //        confirmationDialog.value.showConfirmation({
    //            title: 'Confirmation',

    //            message: props.mode === 'create' ? 'Êtes-vous sûr de vouloir ajouter ce téléphone ?' : props.mode === 'update' ? 'Êtes-vous sûr de vouloir modifier ce téléphone ?' : '',

    //            yesMessage: props.mode === 'create' ? 'AJOUTER' : props.mode === 'update' ? 'MODIFIER' : '',

    //            confirmCallback: async () => {
    //                if (props.mode === 'create') {
    //                    const response = await service.createTelephone(
    //                        phoneNumber.value,
    //                        telephoneType.value.ID,
    //                        intTelDialCode.value.ID,
    //                        notes.value,
    //                        telephoneData.value.ID_AT_EntityAddress,
    //                    );
    //                    console.log("CREATE response", response);  
    //                    if (response.code != 1) {
    //                        showNotification({
    //                            title: response.header,
    //                            message: response.message,
    //                            code: response.code
    //                        });
    //                    } else {
    //                        showNotification({
    //                            title: response.header,
    //                            message: response.message,
    //                             actionMessage: "Ajout non effectué",
    //                            code: response.code,
    //                            duration: 4500
    //                        });

    //                        if (response.code === 1) {
    //                            props.onTelephoneEvent();
    //                            closeForm();
    //                        }
    //                    }
    //                    props.onTelephoneEvent();
    //                    closeForm();
    //                }
    //                else if (props.mode === 'update') {
    //                    try {
    //                        const response = await service.updateTelephone(
    //                            telephoneData.value.ID,
    //                            phoneNumber.value,
    //                            telephoneType.value.ID,
    //                            intTelDialCode.value.ID,
    //                            notes.value,
    //                            telephoneData.value.ID_AT_EntityAddress,
    //                        );
    //                        console.log("UPDATE response", response);
    //                        if (response.code != 1) {
    //                            showNotification({
    //                                title: response.header,
    //                                message: response.message,
    //                                code: response.code
    //                            });
    //                            props.onTelephoneEvent();
    //                            closeForm();
    //                        } else {
                                
    //                            showNotification({
    //                                title: response.header,
    //                                message: response.message,
    //                                 actionMessage: "Modiciation non effectuée",
    //                                code: response.code,
    //                                duration: 4500
    //                            });

    //                            if (response.code === 1) {
    //                                props.onTelephoneEvent();
    //                                closeForm();
    //                            }        
    //                            props.onTelephoneEvent();
    //                            closeForm();
    //                        }                           
    //                    } catch (err) {
    //                        showNotification({
    //                            title: "Erreur critique",
    //                            message: err,
    //                             actionMessage: "Modiciation non effectuée",
    //                            code: 4,
    //                            duration: 8000
    //                        });
    //                    }
    //                }
    //            },
    //            cancelCallback: () => { }
    //        });
    //    }
    //}

    defineExpose({ openForm, closeForm, setInitialData });

    function logout() {
        props.onLogoutEvent();
        closeForm();
    }

    
</script>

<template>
    <!--Component for confirming the user's choice-->
    <ConfirmDialogue ref="confirmationDialog" />
    <ConfirmDialogue ref="deleteCodeConfirmationDialogue" />
    
    <div v-if="isVisible" class="logout-overlay" @click.self="closeForm">
        <div class="bg-b8 b-secondaryLight br-5 p-10 w-30 flex-c a-center m-5" @click.stop>
            <p class="w-100 c-b4 fs-12rem bg-b6 p-2 b-secondaryLight br-5">
                OSSOLE account (GatexInfo SARL)
            </p>
            <div class="j-top c-white">
                <p>
                    Vous vous êtes connecté
                </p>
                <p>
                    avec l'e-mail <span class="fw-bold">{{userData.email}}</span>
                </p>
                <p>
                    en tant que <span class="fw-bold">{{userData.first_name}} {{userData.last_name}}</span>
                </p>
                <p class="mb-5">
                    Votre role: <span class="fw-bold">{{userRole}}</span>
                </p>
            </div>
            
            <button class="tiny-button w-10 h-auto flex-r j-center a-center" type="button" @click="logout" title="Log out">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                </svg>
            </button>
        </div>
    </div>
</template>

<style scoped>
    .logout-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: end;
        align-items: start;
        z-index: 1000;
    }  

</style>