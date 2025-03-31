<script setup lang="ts">

  /*  import { ref, onMounted, nextTick } from 'vue';

    import { SimpleEntityService } from '~/api/services/EntityService_new'    
    import { SimpleTaskService } from '~/api/services/TaskService';
    import { SimpleUserService } from '~/api/services/SimpleUserService';

    import { showNotification } from '@/utils/notificationService';

    import type Entity from '~/api/models/Entity';
    import type Task from '~/api/models/Task/Task';
    import type TaskType from '~/api/models/Task/TaskType';
    import type TaskCategory from '~/api/models/Task/TaskCategory';
    import type TaskPriority from '~/api/models/Task/TaskPriority';
    import type TaskStatus from '~/api/models/Task/TaskStatus';
    import type User from '~/api/models/User';
    import type Tag from '~/api/models/Task/Tag';
    import type EntityReduced from '~/api/models/Task/EntityReduced';

    import CustomComboBox from '~/components/CustomComboBox.vue';
    import CustomListView from '~/components/CustomListView.vue';

    import ConfirmDialogue from '@/components/ConfirmDialogue.vue';
    import FloatingMessage from '@/components/FloatingMessage.vue';
    import UserIcon from '@/components//UserIcon.vue';


definePageMeta({
  layout: 'tasks',
  // name: 'index',
  // alias: 'index',
  title: 'Tasks',
  description: 'Sip, Savor, and Spark Ideas at Cafe Bella Vista!',
  navOrder: 1,
  type: 'primary',
  icon: 'i-mdi-home',
  accessLevel: 1,
  // ogImage: 'images/ogImage.png', // url or local images inside public folder, for eg, ~/public/images/ogImage.png
})

    const entityService = new SimpleEntityService();
    const taskService = new SimpleTaskService();
    const userService = new SimpleUserService();



    const {
        data: entities,
        pending: pendingEntities,
        error: errorEntities,
        refresh: refreshEntities
    } = await useAsyncData("entity/entities", async () => {
        var tempData = await entityService.getEntities();
        console.log("MOUNTED entities", tempData.entities);
        return tempData.entities;

    });

    const {
        data: tasks,
        pending: pendingTasks,
        error: errorTasks,
        refresh: refreshTasks
    } = await useAsyncData("task/tasks", async () => {
        var tempData = await taskService.getTasks();
        console.log("MOUNTED tasks", tempData.tasks);
        return tempData.tasks;
    });


    const {
        data: taskTypes,
        pending: pendingTaskTypes,
        error: errorTaskTypes,
        refresh: refreshTaskTypes
    } = await useAsyncData("task/TaskTypes", async () => {
        var tempData = await taskService.getTaskTypes();
        console.log("MOUNTED TaskTypes", tempData.taskTypes);
        return tempData.taskTypes;
    });

    const {
        data: taskPriorities,
        pending: pendingTaskPriorities,
        error: errorTaskPriorities,
        refresh: refreshTaskPriorities
    } = await useAsyncData("task/TaskPriorities", async () => {
        var tempData = await taskService.getTaskPriorities();
        console.log("MOUNTED TaskPriorities", tempData.priorities);
        return tempData.priorities;
    });

    const {
        data: taskStatuses,
        pending: pendingTaskStatuses,
        error: errorTaskStatuses,
        refresh: refreshTaskStatuses
    } = await useAsyncData("task/TaskStatuses", async () => {
        var tempData = await taskService.getTaskStatuses();
        console.log("MOUNTED TaskStatuses", tempData.statuses);
        return tempData.statuses;
    });

    const {
        data: taskCategories,
        pending: pendingTaskCategories,
        error: errorTaskCategories,
        refresh: refreshTaskCategories
    } = await useAsyncData("task/TaskCategories", async () => {
        var tempData = await taskService.getTaskCategories();
        console.log("MOUNTED TaskCategories", tempData.categories);
        return tempData.categories;
    });

    const {
        data: tags,
        pending: pendingTags,
        error: errorTags,
        refresh: refreshTags
    } = await useAsyncData("task/tags", async () => {
        var tempData = await taskService.getTaskTags();
        console.log("MOUNTED TaskTags", tempData.tags);
        return tempData.tags;
    });

    const {
        data: users,
        pending: pendingUsers,
        error: errorUsers
    } = await useAsyncData("user/users", async () => {
        var tempData = await userService.getUsers();
        console.log("MOUNTED users", tempData.users);
        return tempData.users;
    });

    //constants for collecting essential (entities) and auxiliary (tasks, entities, users, taskTypes, etc.) data
    const selectedUserId = ref(0);
    const selectedTaskStatusId = ref(0);
    const selectedTaskTypeId = ref(0);
    const selectedTaskCategoryId = ref(0);
    const selectedTaskPriorityId = ref(0);
    const selectedTaskTagId = ref(0);
    const selectedentitzId = ref(0);
    const selectedStartCreatedDate = ref('');
    const selectedEndCreatedDate = ref('');

    const searchQuery = ref('');

    const gridViewSelected = ref(true);
    const tableViewSelected = ref(false);

    function selectViewMode() {
        console.log("GridView: ", gridViewSelected.value);
        console.log("TableView: ", tableViewSelected.value);
        tableViewSelected.value = !tableViewSelected.value;
        gridViewSelected.value = !gridViewSelected.value;                
              

    }


    function resetFilters() {
        selectedUserId.value = 0;
        selectedTaskStatusId.value = 0;
        selectedTaskTypeId.value = 0;
        selectedTaskCategoryId.value = 0;
        selectedTaskPriorityId.value = 0;
        selectedTaskTagId.value = 0;
        selectedentitzId.value = 0;
        selectedStartCreatedDate.value = '';
        selectedEndCreatedDate.value = '';
        searchQuery.value = '';
    }    

    const selectedTask: Ref<Task> = ref<Task>(null);

    function convertDate(dateTimeString: String) {
        let convDate = new Date(dateTimeString.slice(0, 16));
        return convDate.toLocaleDateString(undefined, { day: 'numeric' }) + "." +
            convDate.toLocaleDateString(undefined, { month: 'numeric' }) + "." +
            convDate.toLocaleDateString(undefined, { year: 'numeric' });
    }
    */
</script>
<template>

    <div class="content">
        <div class="search-container">
            <div class="inputs-container">
                <!--Input element for searching for entities based on their names-->
                <input v-model="searchQuery" type="text" placeholder="Rechercher une tâche..."
                       class="custom-text-input search-entity">

                <button class="blue-button" @click="RefreshTasks()" v-if="!pendingTasks">
                    <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14"
                         data-testid="Icon::bold/interface-arrows-synchronize" height="1em" width="1em" class="">
                        <path d="M14 10.18l-.5-1.92a.76.76 0 00-.91-.55l-1.93.49a.75.75 0 00-.56.61.77.77 0 00.36.76l.36.21a.28.28 0 01.12.18.25.25 0 01-.07.2A5.47 5.47 0 017 12a5.05 5.05 0 01-4.72-3.29.74.74 0 00-1-.44.74.74 0 00-.44 1A6.56 6.56 0 007 13.52a7 7 0 005.24-2.64.25.25 0 01.32-.05l.3.18a.79.79 0 00.39.11.75.75 0 00.73-.94zM1.41 6.29l1.93-.49a.75.75 0 00.56-.61.77.77 0 00-.36-.76l-.31-.18a.28.28 0 01-.12-.18.27.27 0 01.07-.21A5.47 5.47 0 017 2a5.05 5.05 0 014.72 3.31.75.75 0 101.4-.52A6.56 6.56 0 007 .48a7.07 7.07 0 00-5.19 2.67.25.25 0 01-.32.05L1.14 3A.76.76 0 00.3 3a.77.77 0 00-.3.82l.5 1.92a.76.76 0 00.73.57z">
                        </path>
                    </svg>
                </button>
                <!--Custom elements for searching for tasks based on their type, status, country and locality (the latter onle once a country has been selected)-->
                
                <!--Custom toggle for selecting how to displaz tasks - as GRID or as TABLE-->
                <div class="flex-r a-center j-stretch br-5 b-b10">
                    <div v-if="gridViewSelected" class="bg-b6 w-50 h-100 p-0 m-0 flex-r  br-l j-center a-center task-detail-item" @click="selectViewMode">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="white" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
                        </svg>
                        <span class="tooltiptext-l">Vue grid selectée</span>
                    </div>
                    <div v-else-if="!gridViewSelected" class="bg-t w-50 h-100 p-0 m-0 flex-r  j-center a-center task-detail-item" @click="selectViewMode">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
                        </svg>
                        <span class="tooltiptext-l">Selecter vue grid</span>
                    </div>
                    <div v-if="tableViewSelected" class="bg-b6 w-50 h-100 p-0 m-0 flex-r  j-center a-center br-r task-detail-item" @click="selectViewMode">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="white" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0 1 12 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5" />
                        </svg>
                        <span class="tooltiptext-r">Vue tableau selectée</span>
                    </div>
                    <div v-else-if="!tableViewSelected" class="bg-t w-50 h-100 p-0 m-0 flex-r  j-center a-center task-detail-item" @click="selectViewMode">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0 1 12 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5" />
                        </svg>
                        <span class="tooltiptext-r">Selecter vue tableau</span>
                    </div>
                </div>
                <CustomComboBox :options="taskTypes" v-model="selectedTaskTypeId" option-value-key="ID"
                                option-text-key="Name" placeholder="Type de tàche..." class="form-control model-list" />
                <CustomComboBox :options="entities" v-model="selectedEntityId" option-value-key="ID"
                                option-text-key="FirstName" placeholder="Entité ..." class="form-control model-list" />
                <CustomComboBox :options="users" v-model="selectedUserId" option-value-key="ID"
                                option-text-key="first_name" placeholder="Technicien assigné..." class="form-control model-list" />


                <CustomComboBox :options="taskStatuses" v-model="selectedTaskStatusId" option-value-key="ID"
                                option-text-key="Name" placeholder="Statut..." class="form-control model-list" />
                <CustomComboBox :options="taskPriorities" v-model="selectedTaskPriorityId" option-value-key="ID"
                                option-text-key="Name" placeholder="Priorité ..." class="form-control model-list" />
                <CustomComboBox :options="taskCategories" v-model="selectedTaskCategoryId" option-value-key="ID"
                                option-text-key="Name" placeholder="Catégorie..." class="form-control model-list" />
                <CustomComboBox :options="tags" v-model="selectedTaskTagId" option-value-key="ID"
                                option-text-key="Name" placeholder="Tag..." class="form-control model-list" />

                <!--Button that resets search filters-->
                <button class="blue-button" @click="resetFilters">
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-clear-all" width="24" height="24"
                         viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
                         stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M8 6h12" />
                        <path d="M6 12h12" />
                        <path d="M4 18h12" />
                    </svg>
                    R initialiser les filtres
                </button>

            </div>
        </div>
        <div class="global-container">            
            <div class="" v-if="tasks">
                <div class="w-33" v-if="gridViewSelected">
                    <CustomListView ref="listView" v-model="selectedTask" :items="tasks" :allow-selection="true"
                                    :show-details="true" :allow-deselection="false" class="entity-listview">
                        <template v-slot:taskItem="{ item }">
                            <div class="mb-2 flex-c a-stretch br-5 " @click="itemClick(item)">
                                <div class="f-1 flex-r w-100 j-stretch mb-2">
                                    <div class="f-4 fw-bold  task-detail-item">
                                        {{ item.Title }}
                                        <span class="tooltiptext-r">Titre du ticket</span>
                                    </div>
                                    <div class="f-1"></div>
                                    <div class="f-2 ta-bottom mr-2 task-detail-item">
                                        {{ item.TaskIdentifier }}
                                        <span class="tooltiptext-l">Numéro du ticket</span>
                                    </div>
                                </div>

                                <div class="f-7 flex-c w-full a-bottom b-b9i mb-2">
                                    <div class="f-1 flex-r a-bottom bg-t c-br mr-2  mb-2 task-detail-item">
                                        <p v-if="item.entity.FirstName && item.entity.LastName">{{ item.entity.FirstName }} {{ item.entity.LastName }}</p>
                                        <p v-else>{{ item.entity.CompanyName }}</p>
                                        <span class="tooltiptext-l">
                                            <p v-if="item.entity.FirstName && item.entity.LastName">Entité: {{ item.entity.FirstName }} {{ item.entity.LastName }}</p>
                                            <p v-else>Entité: {{ item.entity.CompanyName }}</p>
                                        </span>
                                    </div>

                                    <div class="f-3 w-100 flex-r a-stretch mb-2">

                                        <div class="f-1 flex-c  a-stretch">
                                            <div class=" br-10 ta-center w-fit h-fit p-2 fw-bold bg-b9  mb-2 task-detail-item">
                                                {{item.task_status.Name}}
                                                <span class="tooltiptext">Status du ticket: {{item.task_status.Name}}</span>
                                            </div>
                                            <div v-if="item.task_priority.ID==1" class=" br-5 w-fit h-fit p-2 fw-bold bg-critical mb-2 task-detail-item">
                                                {{item.task_priority.Name}}
                                                <span class="tooltiptext">Priorité du ticket: {{item.task_priority.Name}}</span>
                                            </div>
                                            <div v-else-if="item.task_priority.ID==2" class=" br-10 w-fit h-fit p-2 fw-bold bg-elevated mb-2 task-detail-item">
                                                {{item.task_priority.Name}}
                                                <span class="tooltiptext">Priorité du ticket: {{item.task_priority.Name}}</span>
                                            </div>
                                            <div v-else-if="item.task_priority.ID==3" class=" br-5 w-fit h-fit p-2 fw-bold bg-medium mb-2 task-detail-item">
                                                {{item.task_priority.Name}}
                                                <span class="tooltiptext">Priorité du ticket: {{item.task_priority.Name}}</span>
                                            </div>
                                            <div v-else-if="item.task_priority.ID==4" class=" br-5 w-fit h-fit p-2 fw-bold bg-weak mb-2 task-detail-item">
                                                {{item.task_priority.Name}}
                                                <span class="tooltiptext">Priorité du ticket: {{item.task_priority.Name}}</span>
                                            </div>
                                            <div v-else class=" br-5 w-fit h-fit p-2 fw-bold bg-planned  mb-2">{{item.task_priority.Name}}</div>
                                            <div class="br-5 w-fit h-fit p-2 fw-bold bg-b9 mb-2 task-detail-item">
                                                {{item.task_category.Name}}
                                                <span class="tooltiptext">Catégorie du ticket: {{item.task_category.Name}}</span>
                                            </div>
                                        </div>

                                        <div class="f-3 b-b9 br-5 p-1 ml-2">{{item.Description}}</div>
                                    </div>

                                    <div class="f-1 w-100 flex-r a-stretch j-stretch bg-t">
                                        <div class="f-1 bg-red br-5 ta-center w-fit h-fit p-2 fw-bold  mb-2 task-detail-item " v-if="item.EndDate">
                                            {{item.EndDate}}
                                            <span class="tooltiptext">Date d'échéance: {{item.EndDate}}</span>
                                        </div>
                                        <div class="f-1 bg-green br-5 ta-center w-fit h-fit p-2 fw-bold mb-2 task-detail-item " v-else>
                                            Aucune
                                            <span class="tooltiptext">Acune date d'échéance</span>
                                        </div>
                                        <div class="f-4 flex-r a-center j-bottom bg-t">
                                            <DateBox v-if="item.CreatedDate" class=" h-fit ml-2" :dateTime="item.CreatedDate" :dateType="'created'"></DateBox>
                                            <!--<UserIcon class=" h-fit ml-2" :firstName="item.created_user.first_name" :secondName="item.created_user.last_name" :mode="'Creé par'"></UserIcon>-->
                                            <UserIcon v-if="item.created_user" class=" h-fit ml-2" :user="item.created_user" :mode="'Creé par'"></UserIcon>
                                            <DateBox v-if="item.ModifiedDate" class=" h-fit ml-2" :dateTime="item.ModifiedDate" :dateType="'modified'"></DateBox>
                                            <!--<UserIcon class=" h-fit ml-2" :firstName="item.modified_user.first_name" :secondName="item.modified_user.last_name" :mode="'Modifié par'"></UserIcon>-->
                                            <UserIcon v-if="item.modified_user" class=" h-fit ml-2" :user="item.modified_user" :mode="'Modifié par'"></UserIcon>
                                        </div>
                                    </div>
                                </div>
                                <div class="f-1 flex-r j-space-between mb-2">
                                    <div v-if="item.tags.length==0" class="br-5 w-fit h-fit fw-bold  task-detail-item">
                                        ...
                                        <span class="tooltiptext">Acun tag à montre</span>
                                    </div>
                                    <div v-else-if="item.tags.length==1" class="br-5 w-fit h-fit p-1 fw-bold bg-b6 task-detail-item">
                                        #{{item.tags[0].Name}}
                                        <span class="tooltiptext">Tâche tag:{{item.tags[0].Name}}</span>
                                    </div>

                                    <div v-else-if="item.tags.length==2" class="flex-r j-top a-center task-detail-item">
                                        <div class="br-10 w-fit h-fit p-1 fw-bold bg-b6">
                                            #{{item.tags[0].Name}}
                                        </div>
                                        <div class="br-10 w-fit h-fit p-1 ml-2 fw-bold bg-b6">
                                            #{{item.tags[1].Name}}
                                        </div>
                                        <span class="tooltiptext">Tâche tags:{{item.tags[0].Name}} // {{item.tags[1].Name}}</span>
                                    </div>

                                    <div v-else class="flex-r j-top a-center mb-2 task-detail-item">
                                        <div class="br-10 w-fit h-fit p-1 fw-bold bg-b6">
                                            #{{item.tags[0].Name}}
                                        </div>
                                        <div class="br-10 w-fit h-fit p-1 ml-2 fw-bold bg-b6">
                                            #{{item.tags[1].Name}}
                                        </div>
                                        <div class="br-10 w-fit h-fit p-1 ml-2 fw-bold bg-b6">
                                            +{{item.tags.length-2}}
                                        </div>
                                        <span class="tooltiptext">Tâche tags: <span v-for="(tag, index) in item.tags" :key="`entry-${tag.ID}`">{{tag.Name}} // </span></span>
                                    </div>

                                    <div class="w-25 fw-bold task-detail-item">
                                        #{{item.CountIntervention}}
                                        <span class="tooltiptext">Nombre d'interventions <br />pour ce ticket: {{item.CountIntervention}}</span>
                                    </div>
                                    <div class="w-25 flex-r j-bottom">
                                        <!--<UserIcon v-for="(tech, index) in item.techs" :key="`entry-${tech.user_id}`" :firstName="tech.first_name" :secondName="tech.last_name" :mode="'Assigné à'"></UserIcon>-->
                                        <UserIcon v-for="(tech, index) in item.techs" :key="`entry-${tech.user_id}`" :user="tech" :mode="'Assigné à'"></UserIcon>
                                    </div>
                                </div>



                            </div>
                        </template>
                    </CustomListView>
                </div>

                <div v-else-if="tableViewSelected" class="t-container">
                    <table class="t">
                        <thead class="th">
                            <tr>
                                <th class="thc">#</th>
                                <th class="thc">Titre</th>
                                <th class="thc">Description</th>
                                <th class="thc">Client</th>
                                <th class="thc">Statut</th>
                                <th class="thc">Priorité</th>
                                <th class="thc">Categorie</th>
                                <th class="thc">Tag</th>
                                <th class="thc">Assignée à</th>
                                <th class="thc">Creé</th>
                                <th class="thc">Creé par</th>
                                <th class="thc">Modifié</th>
                                <th class="thc">Modifié par</th>
                                <th class="thc">Date de commencement</th>
                                <th class="thc">Date d'échéance</th>
                                <th class="thc">Interventions</th>
                            </tr>
                        </thead>
                        <tbody class="tb">
                            <tr class="tdr" v-for="item in tasks" :key="item.ID">
                                <td class="tdc">{{item.TaskIdentifier}}</td>
                                <td class="tdc ">{{item.Title}}</td>
                                <td class="tdc task-detail-item">
                                    ...
                                    <span class="tooltiptext-tab">{{item.Description}}</span>
                                </td>
                                <td class="tdc">
                                    <p v-if="item.entity.FirstName && item.entity.LastName">{{ item.entity.FirstName }} {{ item.entity.LastName }}</p>
                                    <p v-else>{{ item.entity.CompanyName }}</p>
                                </td>
                                <td class="tdc">
                                    <div class="br-10 ta-center w-100 flex-r c-white j-center bg-b6 p-1">{{item.task_status.Name}}</div>
                                </td>
                                <td class="tdc">
                                    <div v-if="item.task_priority.ID==1" class=" br-5 w-100 flex-r j-center p-1 bg-critical">{{item.task_priority.Name}}</div>
                                    <div v-else-if="item.task_priority.ID==2" class=" br-5 w-100 flex-r j-center p-1 bg-elevated">{{item.task_priority.Name}}</div>
                                    <div v-else-if="item.task_priority.ID==3" class=" br-5 w-100 flex-r j-center p-1 bg-medium">{{item.task_priority.Name}}</div>
                                    <div v-else-if="item.task_priority.ID==4" class=" br-5 w-100 flex-r j-center p-1 bg-weak">{{item.task_priority.Name}}</div>
                                    <div v-else class=" br-5 w-100 flex-r j-center p-1 bg-planned">{{item.task_priority.Name}}</div>
                                </td>
                                <td class="tdc">
                                    <div class="br-10 ta-center w-100 flex-r c-white j-center p-1 bg-b6">{{item.task_category.Name}}</div>
                                </td>
                                <td class="tdc">
                                    <div class="task-detail-item">
                                        ...
                                        <span class="tooltiptext-tab">Tâche tags: <span v-for="(tag, index) in item.tags" :key="`entry-${tag.ID}`">{{tag.Name}} // </span></span>
                                    </div>
                                </td>
                                <td class="tdc flex-r j-center">
                                    <UserIcon v-for="(tech, index) in item.techs" :key="`entry-${tech.user_id}`" :user="tech" :mode="'table'"></UserIcon>
                                </td>
                                <td class="tdc">
                                    <p v-if="item.CreatedDate">
                                        {{convertDate(item.CreatedDate)}}
                                    </p>
                                    <p v-else>-</p>
                                </td>
                                <td class="tdc"><UserIcon v-if="item.created_user" class=" h-fit ml-2" :user="item.created_user" :mode="'table'"></UserIcon></td>
                                <td class="tdc">
                                    <p v-if="item.ModifiedDate"> {{convertDate(item.ModifiedDate)}}</p>
                                    <p v-else>-</p>
                                </td>
                                <td class="tdc"><UserIcon v-if="item.modified_user" class=" h-fit ml-2" :user="item.modified_user" :mode="'table'"></UserIcon></td>
                                <td class="tdc">
                                    <p v-if="item.StartDate">{{ convertDate(item.StartDate) }}</p>
                                    <p v-else>-</p>
                                </td>
                                <td class="tdc">
                                    <p v-if="item.EndDate">{{ convertDate(item.EndDate) }}</p>
                                    <p v-else>-</p>
                                </td>
                                <td class="tdc">{{item.CountIntervention}}</td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colspan="16" class="tf">
                                    Nombre total de tâches: {{tasks.length}}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>                
            </div>
        </div>            
    </div>
</template>

<style scoped>
    /*class for div containing TABLE*/
    .t-container {
        height: calc(100vh - 280px);
        overflow-y: auto;
    }
    /*class for customary styling of the TABLE*/
    .t {
        width: 100%;      
        padding: 1px;
        margin: auto;
        align-self: center;
        color: white;
        border: 2px solid lightskyblue;
    }
    /*style for TABLE-HEAD*/
    .th {
        
    }
   
    /*style for TABLE-HEAD CELL*/
    .thc {
        background-color: #312c63;
        text-align: center;
        vertical-align: middle;
        padding: 2px 2px 2px 2px;
        position: sticky;
        top: 0px;
        z-index:5;
    }
    /*style for TABLE-BODY*/
    .tb {
        background-color: #394f90;
       
    }
    /*style for TABLE-DATA-ROW*/
    .tdr {
        border-color: #312c63;
        border-width:2px;
        border-style:solid none solid none;
    }
    /*style for TABLE-DATA CELL*/
    .tdc {
      text-align:center;
      vertical-align:middle;
      padding:2px 2px 2px 2px;      
    }
    /*style for TABLE-FOOTER*/
    .tf {
        width: 100%;
        background-color: #312c63;
        text-align: center;
        vertical-align: middle;
        padding: 2px 2px 2px 2px;
        align-self: center;
        position: sticky;
        color: lightskyblue;
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
        width: 550px;
        flex-shrink: 0;
    }

    .entity-listview {
        height: calc(100vh - 280px);
        
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


   

    .entity-row-item {
        width: 340px;
        padding: 10px;
    }


    .details-right-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 50%;
        padding: 10px;
    }

    .details-left-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 50%;
        padding: 10px;
    }

    .details-left-inner-container {
        width: 100%;
        max-width: 400px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }

    .detail-row {
        display: flex;
        justify-content: flex-start;
        width: 100%;
        margin-bottom: 5px;
    }


    .detail-value {
        text-align: left;
    }

    .licence-serial-number {
        width: 400px;
        height: 130px;
        overflow-y: auto;
        background-color: rgba(000, 000, 000, 0.2);
        padding: 5px;
        border: 1px solid black;
    }

    .licence-serial-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 5px;
    }

    .left-license-serial-container {
        flex: 3;
        text-align: center;
    }

    .right-license-serial-container {
        flex: 1;
        text-align: center;
        border-left: 1px solid black;
    }

    .licence-serial-title {
        text-align: center;
        font-weight: bold;
        margin-right: 40px;
    }

    .licence-serial-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px;
    }

    .licence-serial-buttons-container {
        display: flex;
        flex-direction: column;
        gap: 5px;
        margin-left: 10px;
    }
</style>