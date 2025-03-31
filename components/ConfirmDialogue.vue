<template>
    <transition name="fade">
        <div v-if="isVisible" class="confirmation-overlay">
            <div class="bg-b10 b-b3 br-10 p-10 flex-c ">
                <div class="ta-center fw-bold c-b4 f-1">{{ title }}</div>
                <div class="ta-center c-b4 f-1 mb-2">{{ message }}</div>
                <div class="flex-r">
                    <button class="tiny-button  h-full w-40 flex-r j-center a-center bg-green m-auto" @click="confirm" title="Enregistrer les modifications">                    
                        {{yesMessage}}
                    </button>
                    <div class="w-10"></div>
                    <button class="tiny-button h-full w-40 flex-r j-center a-center bg-red m-auto" @click="cancel" title="Annuler les modifications">                       
                        ANNULER
                    </button>                   
                </div>
            </div>
        </div>
    </transition>
</template>


<script setup>
    import { ref } from 'vue';

    const isVisible = ref(false);
    const title = ref('');
    const message = ref('');
    const yesMessage = ref('');
    let onConfirm = () => { }; // Initialise avec une fonction vide par défaut
    let onCancel = () => { }; // Idem pour onCancel

    //onMounted(() => {
    //    console.log("confirmDialogue is mounted");
    //});

    function showConfirmation({ title: newTitle, message: newMessage, yesMessage:newYesMessage, confirmCallback, cancelCallback }) {
        title.value = newTitle;
        message.value = newMessage;
        yesMessage.value = newYesMessage;
        // Assurez-vous que confirmCallback et cancelCallback sont des fonctions avant de les assigner
        onConfirm = typeof confirmCallback === 'function' ? confirmCallback : () => { console.warn("confirmCallback n'est pas une fonction"); };
        onCancel = typeof cancelCallback === 'function' ? cancelCallback : () => { console.warn("cancelCallback n'est pas une fonction"); };
        isVisible.value = true;
    }

    function confirm() {
        if (typeof onConfirm === 'function') {
            onConfirm();
        } else {
            console.error('onConfirm n\'est pas une fonction');
        }
        isVisible.value = false;
    }

    function cancel() {
        if (typeof onCancel === 'function') {
            onCancel();
        } else {
            console.error('onCancel n\'est pas une fonction');
        }
        isVisible.value = false;
    }

    defineExpose({ showConfirmation });
</script>


<style scoped>
    .confirmation-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        display: flex;
        justify-content: center;
        background-color: rgba(0, 0, 0, 0.5);
        align-items: center;
        z-index: 3000;
    }

    

   
</style>