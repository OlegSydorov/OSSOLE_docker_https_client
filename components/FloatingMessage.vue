 <template>
    <transition name="fade">
        <div v-if="notification.isVisible" :class="`message-container code-${notification.code}`">
            <div class="message-header">
                <div class="title-container">{{ notification.title }}</div>
                <button @click="closePopup">&times;</button>
            </div>
            <div class="message-body">
                {{notification.actionMessage}}
                {{ notification.message }}
            </div>
        </div>
    </transition>
</template>

<script setup>
import { notification } from '@/utils/notificationService';

function closePopup() {
    notification.value.isVisible = false;
    clearTimeout(notification.value.timeout);
}

</script>

<style scoped>
.message-container {
    position: fixed;
    /* Corrigé */
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2000;
    border: 1px solid #000000;
    /* Corrigé */
    padding: 10px;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .2);
    display: flex;
    flex-direction: column;
    /* Corrigé */
    max-width: 500px;
    background-color: white;
    /* Assurez-vous que le fond est défini pour une meilleure lisibilité */
    text-align: center;
}

.message-header {
    display: flex;
    align-items: center;
    /* Corrigé */
    padding: 0 10px;
    margin-bottom: 5px;
    margin-right: 10px;
    margin-left: 10px;
    text-align: center;
    position: relative;
}

.title-container {
    flex: 1;
    text-align: center;
    font-weight: bold;
    font-size: 1.0em;
}

.message-body {
    padding: 0 10px;
    white-space: pre;
    margin: 10px 0;
    word-wrap: break-word;
}

.message-header button {
    position: absolute;
    right: -11px;
    /* Positionne le bouton à 10px du bord droit */
    top: 5px;
    /* Aligner le bouton verticalement */
    transform: translateY(-50%);
    /* Centrage précis du bouton */
    border: none;
    background: none;
    cursor: pointer;
    font-size: 1.5em;
    font-weight: bold;
    color: black;
}

/* Styles pour les codes */
.code-1 {
    background-color: #70fd70;
}

.code-2 {
    background-color: #ffffff;
}

.code-3 {
    background-color: #ffff4f;
}

.code-4 {
    background-color: #ff2424;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
    transition: opacity .5s;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}
</style>
