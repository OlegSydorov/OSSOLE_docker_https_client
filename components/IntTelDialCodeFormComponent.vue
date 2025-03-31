<script setup lang="ts">
    import { ref, defineExpose } from 'vue';
    import type IntTelDialCode from '~/api/models/IntTelDialCode';
    import type Country from '~/api/models/Country';    
    //import { SimpleEntityService } from '~/api/services/EntityService';    
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

        onCodeCancel: {
            type: Function,
            default: () => () => {
                console.log("Aucune fonction n'a été spécifiée dans on-code-cancel sur le composant : IntTelDialCoadFormComponent");
            }
    },

        onCodeAdd: {
            type: Function,
            default: () => () => {
                console.log("Aucune fonction n'a été spécifiée dans on-code-add sur le composant : IntTelDialCoadFormComponent");
            }
        }
    });

    //onMounted(() => {
    //    console.log("IntTelDialCodeFormComponent is mounted");
    //});

  //  const service = new SimpleEntityService();   

    const intTelDialCodeData = ref<IntTelDialCode>(props.initialData as IntTelDialCode);

    const code = ref('');
    const regex = ref('');
    const country: Ref<Country> = ref<Country>({ ID: 0, Name: '', CountryCode: '', CanAddLocalities:0 });

    const confirmationDialog = ref(null);

    const isVisible = ref(false);

    function closeForm() {
        isVisible.value = false;
        props.onCodeCancel();
    }


    function handleOverlayClick($event) {
        if ($event.target === $event.currentTarget) {
            closeForm();
        }
    }

    function resetInputs() {
        code.value = '';
        regex.value = '';
        country.value = ({ ID: 0, Name: '', CountryCode: '', CanAddLocalities: 0 });
    }

    async function openForm(canUpdate = true) {
        isVisible.value = true;
        const intTelDialCode = intTelDialCodeData.value;
        console.log(intTelDialCode.country);
        if (props.mode === 'update' && canUpdate) {
            code.value = intTelDialCode.Code.toString();
            regex.value = regExToX(intTelDialCode.Regex);            
            if (intTelDialCode.country) {
                country.value = intTelDialCode.country;
            } else {
                console.warn('intTelDialCode.country is undefined');
            }
           // console.log(code.value, regex.value, country.value);
           // console.log(country.value);            
        }
       
    }

    function setInitialData(newData: IntTelDialCode) {
       // console.log("IntTelDialCodeFormComponent data SET INITIAL DATA", newData);
        intTelDialCodeData.value = newData;
      //  console.log(intTelDialCodeData.value);
    }

    function regExToX(regexStr: string): string {
        const arr1 = regexStr.split("(\\d{");
        var resStr = '';
        var arr2 = Array();
        arr1.forEach((item, index) => arr2[index] = item.replace(/\D/g, ''));
        arr2.forEach((item) => resStr = resStr + 'X'.repeat(item.length > 0 ? Number(item) : 0) + ' ');
      //  console.log("RegEx to X", resStr);
        return resStr;
    }

    function XToRegEx(xStr: string): string {
        var trimmedInput = xStr.trim();
        const arr1 = trimmedInput.split(" ");
        var resStr = "^";        
        arr1.forEach((item) => resStr = resStr + '(\\d{' +(Number(item.length)).toString() +'})');
        resStr = resStr + "$";
      //  console.log("X to RegEx", resStr);
        return resStr;
    }


   
   
    async function openConfirmationDialog() {
        console.log("Data prior to be submitted", code.value, regex.value, XToRegEx(regex.value), country.value);
        console.log("COUNTRY", country.value);
        console.log(!codeLong.value, !codeIncorrect.value, !regexLong.value);
        if (!codeLong.value && !codeIncorrect.value && !regexLong.value) {
            confirmationDialog.value.showConfirmation({
                title: 'Confirmation',

                message: props.mode === 'create' ? 'Êtes-vous sûr de vouloir ajouter cet indicatif téléphonique international?' : props.mode === 'update' ? 'Êtes-vous sûr de vouloir modifier cet indicatif téléphonique international ?' : '',

                yesMessage: props.mode === 'create' ? 'AJOUTER' : props.mode === 'update' ? 'MODIFIER' : '',

                confirmCallback: async () => {
                    if (props.mode === 'create') {
                        const response = await api.entity.createIntTelDialCode(
                            Number(code.value),
                            country.value.ID,
                            XToRegEx(regex.value),
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
                                props.onCodeAdd();
                                closeForm();
                            }
                        }
                        props.onCodeAdd();
                        closeForm();
                    }
                    else if (props.mode === 'update') {
                        try {
                            const response = await api.entity.updateIntTelDialCode(
                                intTelDialCodeData.value.ID,
                                Number(code.value),
                                country.value.ID,
                                XToRegEx(regex.value),
                            );
                            console.log("UPDATE response", response);
                            if (response.code != 1) {
                                showNotification({
                                    title: response.header,
                                    message: response.message,

                                    code: response.code
                                });
                                props.onCodeAdd();
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
                                    props.onCodeAdd();
                                    closeForm();
                                }
                                props.onCodeAdd();
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

    const codeLong = ref(false);
    const codeIncorrect = ref(false);
    
    function codeFilter(event) {        
        var inputText = event.target.value;
      //  console.log("CODE FILTER ", inputText, codeLong.value, codeIncorrect.value);
        if (inputText.length>5) {
            codeLong.value = true;
        }
        else {
            codeLong.value = false;
            if (inputText.charCodeAt(inputText.length - 1) < 48 || inputText.charCodeAt(inputText.length - 1) > 57) {
                codeIncorrect.value = true;
            }
            else {
                codeIncorrect.value = false;
            }
        } 
    }
    const regexLong = ref(false);

    function regexFilter(event) {        
        var inputText = event.target.value;
        const re = /[^ ]/gm;
        var newInput = inputText.replace(re, 'X')
     //   console.log(newInput);      
        regex.value = newInput;        
    }

    function regexLenCheck(event) {   

        var inputText = event.target.value;
        var trimmedInput = inputText.trim();
        var spaceCounter = 0;
        trimmedInput.split('').forEach((item: string) => { if (item == ' ') { spaceCounter++; } });
      //  console.log("RegExLenCheck", inputText, spaceCounter);

        if (trimmedInput.length > 15 + spaceCounter - code.value.length) {
            regexLong.value = true;
        }
        else {
            regexLong.value = false;
        } 
    }

</script>

<template>
    <!--Component for confirming the user's choice-->
    <ConfirmDialogue ref="confirmationDialog" />

    <div v-if="isVisible" class="popup-overlay" @click.self="closeForm">

        <div class="bg-b7 b-b3 br-5 p-10 w-50" @click.stop>
            <!--FORM for adding/editing new details-->
            <form class="w-full flex-c a-center" @submit.prevent="openConfirmationDialog">
                <div class="ta-center fw-bold c-b4 f-1">
                    {{ props.mode === 'create' ? "Ajouter un indicatif téléphonique" : props.mode === 'update' ? "Modifier un indicatif téléphonique" : ""}}
                </div>

                <!--Form section for entering new telephone-->
                <div class="flex-r a-top bg-t j-center w-full  mb-2">
                    <!--Section for selecting/updating telephone type-->
                    <div class="f-3 flex-c a-top bg-t">
                        <label for="title" class="w-full detail-label ml-5">Pays*</label>
                        <select class="detail-input w-70 ta-top"
                                v-model="country"
                                required>
                            <option v-if="country.ID==0" :value="country" disabled>Choisir pays...</option>
                            <option v-for="(item, key) in props.countryOptions" :value="item">
                                {{item.Name}}
                            </option>
                        </select>
                    </div>
                    <!--Section for selecting/updating telephone code-->
                    <div class="f-3 flex-c bg-t ml-2">
                        <label for="title" class="w-full detail-label ml-5">Indicatif téléphonique international*</label>
                        <input class="detail-input w-full ta-top"
                               :class="{'validation-alert':codeIncorrect ||codeLong}"
                                id="intTelDialCode"
                               v-model="code"
                               placeholder="Indicatif téléphonique..."
                               @input="codeFilter"
                               required />
                        <p class="detail-label c-b4">MAX 5 chiffres</p>
                        <p v-if="codeIncorrect" class="detail-label c-red fw-bold">Indicatif téléphonique ne doit contenir que des chiffres</p>
                        <p v-if="codeLong" class="detail-label c-red fw-bold">Indicatif téléphonique est d'une longueur incorrecte</p>
                    </div>
                    <!--Section for selecting/updating telephone code-->
                    <div class="f-4 flex-c  bg-t ml-2">
                        <label for="title" class="w-full detail-label ml-5">Structure du numéro (p.ex. X XX XXX XX XX)*</label>
                        <input class="detail-input w-full ta-top"
                               :class="{'validation-alert':regexLong}"
                                id="phoneNumber"
                               v-model="regex"
                               placeholder="X XX XXX XX XX"
                               required
                               @input="regexFilter"
                               @change="regexLenCheck"/>
                        <p v-if="regexLong" class="detail-label c-red fw-bold">La longueur cumulative de l'indicatif et du numéro ne doit pas dépasser 15 chiffres</p>
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