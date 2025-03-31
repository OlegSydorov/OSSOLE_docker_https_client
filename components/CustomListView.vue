<script setup lang="ts">
    import { computed } from 'vue';
    import type Entity from '~/api/models/Entity';
    import type EntityArticle from '~/api/models/EntityArticle';
    import type LicenseAndSerial from '~/api/models/LicenseAndSerial';
    import type Task from '~/api/models/Task/Task';
    import type NinjaOneOrganization from '~/api/models/NinjaOne/NinjaOneOrganization';

// Utilisez une union de types pour le type d'items
const props = defineProps<{
    items: Array<Entity | EntityArticle | LicenseAndSerial | Task | NinjaOneOrganization>;
    modelValue: Entity | EntityArticle | LicenseAndSerial | Task | NinjaOneOrganization| null;
    showDetails: boolean;
    allowSelection: boolean;
    allowDeselection: boolean;
}>();

const emits = defineEmits(['update:modelValue', 'itemSelected', 'detailToggled']);

// Fonctions pour déterminer le type d'un item
    const isEntity = (item: Entity | EntityArticle | LicenseAndSerial | Task): item is Entity => 'ID_EntityType' in item;
    const isEntityArticle = (item: Entity | EntityArticle | LicenseAndSerial | Task): item is EntityArticle => 'ID_Article' in item;
    const isLicenseAndSerial = (item: Entity | EntityArticle | LicenseAndSerial | Task): item is LicenseAndSerial => 'AssetCode' in item;
    const isTask = (item: Entity | EntityArticle | LicenseAndSerial | Task): item is Task => 'ID_TaskType' in item;
    const isOrganization = (item: Entity | EntityArticle | LicenseAndSerial | Task | NinjaOneOrganization): item is NinjaOneOrganization => 'Description' in item;

const selected = ref(props.modelValue);
const openedDetails = ref<number[]>([]);

    const isSelected = (item: Entity | EntityArticle | LicenseAndSerial | Task | NinjaOneOrganization) => {
    return props.allowSelection && selected.value && 'ID' in item && 'ID' in selected.value && item.ID === selected.value.ID;
};

const isDetailVisible = (index: number) => {
    return props.showDetails && openedDetails.value.includes(index);
};

const toggleDetails = (index: number) => {
    const position = openedDetails.value.indexOf(index);
    if (position !== -1) {
        openedDetails.value.splice(position, 1);
    } else {
        openedDetails.value = [index];
    }
    emits('detailToggled', index);
};

const handleClick = (item, index, event) => {
    const target = event.target as HTMLElement;

    // Vérifie si le clic a été effectué sur un élément devant exclure la fermeture
    if (target.closest('.exclude-from-close') && !target.closest('.exclude-from-detail-toggle')) {
        // Ne fait rien pour permettre des actions spécifiques sur cet élément
        return;
    }

    // Si le clic n'est pas sur un élément à exclure, poursuit avec la logique habituelle
    if (props.allowSelection) {
        if (selected.value && 'ID' in item && item.ID === selected.value.ID && props.allowDeselection && !target.closest('.exclude-from-detail-toggle')) {
            selected.value = null;
            emits('update:modelValue', null);
            emits('itemSelected', null);
        } else {
            selected.value = item;
            emits('update:modelValue', item);
            emits('itemSelected', item);
        }
    }

    // Basculer les détails si le clic n'est pas sur un élément à exclure
    if (props.showDetails && !target.closest('.exclude-from-detail-toggle')) {
        toggleDetails(index);
    }
};


const listElementRefs = ref({});

const preventDetailToggle = (event) => {
    event.stopPropagation();
};

    function selectAndScrollTo(id: number) {

        console.log("CUSTOM LIST VIEW data: ", props.items);
    const itemToSelect = props.items.find((item) => item.ID === id);
    if (itemToSelect) {
        emits('update:modelValue', itemToSelect);
        nextTick(() => {
            if (listElementRefs.value[id])
                listElementRefs.value[id].scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }
};

const setRef = (el, id) => {
    if (el) {
        listElementRefs.value[id] = el;
    }
}

defineExpose({ selectAndScrollTo })
</script>

<template>
    <ul class="custom-list">
        <li v-for="(item, index) in items" :key="item.ID" @click="handleClick(item, index, $event) "
            :ref="el => setRef(el, item.ID)"
            :class="{ 'selected': isSelected(item), 'detail-visible': isDetailVisible(index) }">
            <template v-if="isEntityArticle(item)">
                <slot name="entityArticleItem" :item="item" :preventDetailToggle="preventDetailToggle"></slot>
                <div v-if="isDetailVisible(index)" class="item-detail">
                    <slot name="entityArticleDetail" :item="item" :preventDetailToggle="preventDetailToggle"></slot>
                </div>
            </template>
            <template v-else-if="isEntity(item)">
                <slot name="entityItem" :item="item"></slot>
            </template>
            <template v-else-if="isLicenseAndSerial(item)">
                <slot name="licencesAndSerials" :item="item"></slot>
            </template>
            <template v-else-if="isTask(item)">
                <slot name="taskItem" :item="item"></slot>
            </template>
            <template v-else-if="isOrganization(item)">
                <slot name="organizationItem" :item="item"></slot>
            </template>
        </li>
    </ul>
</template>

<style scoped>
.custom-list {
    list-style: none;
    padding: 0;
    user-select: none;
    color: white;
    font-size: small;
    overflow-y: auto;
}

.custom-list li {
    cursor: pointer;
    padding: 0 5px;
    border-radius: 10px;
}

    .custom-list li:nth-child(odd) {
        background-color: #394f90; /*#5a5f34*/
    }

    .custom-list li:nth-child(even) {
        background-color: #394f90; /*#d7ec63;*/
    }

    .item-detail {
        background-color: #4965b8; /*#eeed8d;*/
        border-top: 2px solid black;
        padding: 5px;
        cursor: auto;        
    }

    .custom-list li:hover {
        background-color: #394f90; /*#96a516;*/
    }

    .custom-list li.selected {
        background-color: #516fc9; /*#fcfd8e;*/
        color: white;
    }

.custom-list li:not(:last-child) {
    border-top: 1px solid black;
    border-right: 1px solid black;
    border-left: 1px solid black;
}

.custom-list li:last-child {
    border: 1px solid black;
}
</style>