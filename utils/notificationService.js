import { ref } from 'vue';

export const notification = ref ({
    isVisible: false,
    title: '',
    actionMessage:'',
    message: '',
    code: 1,
    timeout: null,
});

export function showNotification({ title, message, actionMessage = '', code = 1, duration = 3000}) {
    notification.value.title = title;
    notification.value.message = message;
    notification.value.actionMessage = actionMessage;
    notification.value.code = code;
    notification.value.isVisible = true;

    
    clearTimeout(notification.value.timeout);

    notification.value.timeout = setTimeout(() => {
        notification.value.isVisible = false;
    }, duration);
}