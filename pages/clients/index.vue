<script setup lang="ts">
    import { ref, onMounted, nextTick } from 'vue';
    import { showNotification } from '@/utils/notificationService';
    import type NinjaOneClient from '~/api/models/NinjaOne/NinjaOneClient';
    import ConfirmDialogue from '@/components/ConfirmDialogue.vue';
    import CustomListView from '~/components/CustomListView.vue';
    import FloatingMessage from '@/components/FloatingMessage.vue';
    import { useApi } from '~/api/composables/useApi';
    import { useUser } from '~/api/composables/useUser';
    definePageMeta({
        // layout: 'default',
        //  name: 'index',
        //  alias: 'index',
        title: 'Dashboard',
        description: 'Sip, Savor, and Spark Ideas at Cafe Bella Vista!',
        navOrder: 1,
        type: 'primary',
        icon: 'i-mdi-home',
        accessLevel: 4,
        middleware: 'auth',
        // ogImage: 'images/ogImage.png', // url or local images inside public folder, for eg, ~/public/images/ogImage.png
    })
    const api = useApi();
    const { user } = useUser();
    const confirmationDialog = ref(null);
    const onHold = ref(true);


    const selectedClient: Ref<NinjaOneClient> = ref<NinjaOneClient>({ ID: 0, ClientName: '', ClientDescription: '', Locations: [], OnContract: 0 });
    const clients: Ref<NinjaOneClient[]> = ref([]);
    onMounted(() => {
        console.log(`the component is now mounted.`);
        
        refreshClients();
    })  

    async function refreshClients() {
        onHold.value = true;
        var tempData = await api.invoice.getClients();
        console.log("MOUNTED clients", tempData.clients);
        clients.value = tempData.clients;
        onHold.value = false;
    }   
    // organizations array with tickets and interventions loaded from NinjaOne for current year and month (during DOM mounting)
    //const {
    //    data: clients,
    //    pending: pendingClients,
    //    error: errorClients,
    //    refresh: refreshClients
    //} = await useAsyncData("ninjaOne", async () => {
    //    onHold.value = true;
    //    var tempData = await api.invoice.getClients();
    //    console.log("MOUNTED clients", tempData.clients);
    //    return tempData.clients;
    //});




</script>
<template>
    <ConfirmDialogue ref="confirmationDialog" />
    <FloatingMessage ref="notification" />

    <div class="content">
        <div v-if="onHold==true" class="pos-z-3 bg-mist flex-c a-center j-center w-100 h-100">
            <div class="bg-secondaryLight p-10 br-10">
                <img src='~/assets/images/on_hold_icon.gif' />
            </div>
        </div>
        <div class="global-container">
            <div class="list-container" v-if="clients">
                <CustomListView ref="listView" v-model="selectedClient" :items="clients" :allow-selection="true"
                                :show-details="true" :allow-deselection="false" class="entity-listview">
                    <template v-slot:clientItem="{ item }">
                        <div class="mb-2 flex-c a-stretch br-5 bg-t" >
                            <div v-if="item.OnContract" class="ta-center c-cloud-contract p-2 task-detail-item ">
                                {{ item.ClientName }}
                                <span class="tooltiptext-r-close">Entité: {{item.ClientName }} <br> AVEC CONTRAT</span>
                            </div>

                            <div v-else class="ta-center c-cloud bg-t p-2 task-detail-item">
                                {{ item.ClientName }}
                                <span class="tooltiptext-r-close">Entité: {{item.ClientName }} <br> SANS CONTRAT</span>
                            </div>

                            <div class="flex-r j-center a-center bg-t w-100 b-b9i">

                                <div class="f-1 flex-c j-center a-top bg-t">
                                    <div v-if="item.ClientDescription==''" class="w-100 flex-r j-top a-top ">
                                        <label class="f-1 h-fit ta-bottom p-2 c-shadow">Description</label>
                                        <div class="f-1 h-100 br-10 ta-center p-2 bg-b4 c-grey mb-2">
                                            Aucune description n'existe pour ce client                                                
                                        </div>
                                    </div>
                                    <div v-else class="w-100 flex-r j-top a-top ">
                                        <label class="f-1 h-fit ta-bottom p-2 c-shadow">Description</label>
                                        <div class="f-1 h-100 br-10 ta-center p-2 bg-weak c-w fw-bold  mb-2 task-detail-item">
                                            {{item.ClientDescription}}
                                            <span class="tooltiptext-l">Client: {{item.ClientDescription}}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>                                    
                    </template>
                </CustomListView>
            </div>
        </div>

    </div>
</template>
<style scoped>
    .entity-row-item {
        position: relative;
        display: inline-block;
    }
        /* Tooltip text */
        .entity-row-item .tooltiptext {
            visibility: hidden;
            width: auto;
            height: 100%;
            background-color: lightskyblue;
            color: #596faa;
            text-align: center;
            padding: 5px 0;
            border-radius: 6px;
            /* Position the tooltip text */
            position: absolute;
            z-index: 1;
            bottom: 5%;
            right: 1%;
            /*  margin-left: -60px;*/
            /* Fade in tooltip */
            opacity: 0;
            transition: opacity 0.3s;
        }
        /* Show the tooltip text when you mouse over the tooltip container */
        .entity-row-item:hover .tooltiptext {
            visibility: visible;
            opacity: 0.8;
        }

    .entity-details-container {
        background-color: #394F90; /*#d7eb7c;*/
        border-radius: 5px;
        border: 1px solid white;
    }

    .element-visible {
        display: block;
    }

    .element-invisible {
        display: none;
    }

    .search-container {
        /* Styles du conteneur de recherche */
        width: 100%;
        background-color: #312C63; /*#61fd52*/
        display: flex;
        justify-content: space-between;
        padding: 5px;
        margin-bottom: 10px;
        border-radius: 10px;
        height: 50px;
    }

    .inputs-container {
        width: 100%;
        display: flex;
        gap: 5px;
    }

    .model-list {
        flex: 0 1 auto;
        width: 200px !important;
    }

    .content {
        overflow: hidden;
        height: calc(100vh - 150px);
        display: flex;
        flex-direction: column;
        width: 100%;
    }

    .global-container {
        display: flex;
        flex-grow: 1;
        overflow: hidden;
    }

    .list-container {
        width: 350px;
        flex-shrink: 0;
    }

    .entity-listview {
        height: calc(100vh - 280px);
        overflow-x: hidden;
    }

        .entity-listview::-webkit-scrollbar {
            width: 8px;
        }

        .entity-listview::-webkit-scrollbar-thumb {
            background: #959595;
            border-radius: 5px;
        }

        .entity-listview::-webkit-scrollbar-track {
            background-color: none;
            border-radius: 10px;
        }

            .entity-listview::-webkit-scrollbar-track:hover {
                background-color: black;
            }

        .entity-listview::-webkit-scrollbar-corner {
            background-color: white;
        }

        .entity-listview li:last-child {
            border: 1px solid black;
            border-bottom-left-radius: 5px;
            border-bottom-right-radius: 5px;
        }

        .entity-listview li:first-child {
            border-top-left-radius: 5px;
            border-top-right-radius: 5px;
        }

    .entityArticle-details-container {
        background-color: #394F90; /*#d7eb7c;*/
        margin-right: 5px;
        flex-grow: 1;
        width: calc(100% - 50px);
        border-radius: 5px;
        margin-left: 5px;
        overflow-y: auto;
    }

    .search-entity {
        max-width: 300px;
    }

    .search-article-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 5px;
        background-color: #312C63; /*#61fd52*/
        margin: 5px;
        padding: 5px;
        border-radius: 5px;
    }

    .inputs-article-container {
        display: flex;
        align-items: center;
        gap: 5px;
        flex-grow: 1;
    }

    .article-title {
        margin: 10px;
        text-align: center;
        font-size: x-large;
        color: white;
    }

    .table-container {
        display: flex;
        flex-direction: column;
        width: auto;
        margin: 10px;
        color: white;
    }

    .table-header,
    .table-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .table-header {
        background-color: #312C63; /*#61fd52*/
        border-top-right-radius: 5px;
        border-top-left-radius: 5px;
        font-weight: bold;
    }

    .header-item,
    .row-item {
        flex: 2;
        text-align: center;
        padding: 10px 0;
    }

    .row-item-buttons {
        display: flex;
        justify-content: center;
        gap: 5px;
        align-items: center;
    }

    .table-body {
        overflow-y: auto;
        height: 100%;
    }

    .entity-row-item {
        width: 340px;
        padding: 10px;
        color:blue;
    }
</style>

