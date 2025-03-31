import type { ApiServiceContainer } from "../services/ApiServiceContainer";

export const useApi = () => {
    console.log("useApi executing ...");
    const { $api } = useNuxtApp();
    console.log("global api variable", $api);

    return $api as ApiServiceContainer;
};

/*import { onMounted } from 'vue';

export const useApi = () => {
    console.log("useApi executing ...");
onMounted(() => {
    const { $api } = useNuxtApp();
    if (!$api) {
        console.warn("$api is not available yet");

    } else {
        console.log("API is available:", $api);

    }
    console.log("global api variable", $api);
    return $api as ApiServiceContainer;
});


    
};*/