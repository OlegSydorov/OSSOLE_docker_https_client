<script setup>
import { ref, watch, nextTick, computed } from 'vue';

const props = defineProps({
    options: Array,
    modelValue: Number,
    placeholder: String,
    optionValueKey: { type: String, default: 'value' },
    optionTextKey: { type: String, default: 'text' },
});

const emit = defineEmits(['update:modelValue', 'change']);

const showOptions = ref(false);
const highlightedIndex = ref(-1);
const search = ref('');
const isSearchActive = ref(false); // Pour suivre si une recherche est active

// Calculer les options filtrées basées sur la recherche active
const filteredOptions = computed(() => {
    if (isSearchActive.value && search.value) {
        return props.options.filter(option =>
            option[props.optionTextKey].toLowerCase().includes(search.value.toLowerCase())
        );
    }
    return props.options;
});

const selectOption = (option) => {
    emit('update:modelValue', option[props.optionValueKey]);
    emit('change', option);
    search.value = option[props.optionTextKey];
    showOptions.value = false;
    isSearchActive.value = false;
};

const handleInput = (event) => {
    search.value = event.target.value;
    isSearchActive.value = true;
    highlightBestMatchingOption();
};

const handleFocus = () => {
    if (props.options.length > 0) {
        showOptions.value = true;
        highlightBestMatchingOption();
    }
};

const handleBlur = () => {
    setTimeout(() => {
        showOptions.value = false;
    }, 200);
};

const handleKeydown = (event) => {
    switch (event.key) {
        case 'ArrowDown':
            event.preventDefault();
            highlightedIndex.value = (highlightedIndex.value + 1) % filteredOptions.value.length;
            break;
        case 'ArrowUp':
            event.preventDefault();
            highlightedIndex.value = (highlightedIndex.value - 1 + filteredOptions.value.length) % filteredOptions.value.length;
            break;
        case 'Enter':
            event.preventDefault();
            if (highlightedIndex.value >= 0) {
                selectOption(filteredOptions.value[highlightedIndex.value]);
            }
            break;
    }
    nextTick(scrollToHighlighted);
};

const highlightBestMatchingOption = () => {
    highlightedIndex.value = filteredOptions.value.findIndex(option =>
        option[props.optionTextKey].toLowerCase().startsWith(search.value.toLowerCase())
    );
    if (highlightedIndex.value === -1) {
        highlightedIndex.value = 0; // Par défaut, mettez en surbrillance le premier élément si aucun match direct
    }
};

const scrollToHighlighted = () => {
    nextTick(() => {
        const optionElement = document.querySelector(`.options-list .option-item:nth-child(${highlightedIndex.value + 1})`);
        if (optionElement) {
            optionElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    });
};

watch(() => props.modelValue, (newValue) => {
    if (newValue === null) {
        search.value = '';
        isSearchActive.value = false;
        highlightedIndex.value = -1;
        return;
    }

    const matchingOption = props.options.find(option => option[props.optionValueKey] === newValue);
    if (matchingOption) {
        search.value = matchingOption[props.optionTextKey];
        isSearchActive.value = false; // Réinitialiser l'état de recherche active
    } else {
        search.value = '';
    }
}, { immediate: true });
</script>

<template>
    <div class="combobox-container">
        <input type="text" :value="search" @input="handleInput" @focus="handleFocus" @blur="handleBlur"
            @keydown.down.prevent="handleKeydown" @keydown.up.prevent="handleKeydown"
            @keydown.enter.prevent="handleKeydown" class="combobox-input" :placeholder="placeholder" />
        <ul v-show="showOptions" class="options-list">
            <li v-for="(option, index) in filteredOptions" :key="option[props.optionValueKey]"
                @click="selectOption(option)" :class="{ 'option-item': true, highlighted: index === highlightedIndex }">
                {{ option[props.optionTextKey] }}
            </li>
        </ul>
    </div>
</template>



<style scoped>
.combobox-container {
    position: relative;
    width: 100%;
}

    .combobox-input,
    .combobox-input:focus {
        width: 100%;
        padding: 8px;
        padding-right: 24px;
        padding-left: 15px;
        border: 1px solid black;
        border-radius: 4px;
        background-color: #3F5284; /*#5a5f34*/
        outline: none;
        box-shadow: none;
    }

.dropdown-icon {
    content: '';
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid black;
}

.combobox-input:focus {
    border-radius: 4px 4px 0px 0px;
}

    .options-list {
        position: absolute;
        width: 100%;
        border: 1px solid black;
        border-top: none;
        z-index: 10;
        background: #3F5284; /*#5a5f34*/
        list-style-type: none;
        padding: 0;
        margin: 0;
        max-height: 300px;
        overflow-y: auto;
        border-radius: 0 0 5px 5px;
    }

.option-item {
    padding: 10px;
    cursor: pointer;
}

.option-item {
    border-bottom: 1px solid black;
    font-size: 0.9rem;
}

.option-item:last-child {
    border-bottom: none;
}

    .option-item:hover {
        background-color: #617cc2; /*#c1c261;*/
    }

    .highlighted {
        background-color: #324064 !important; /* #626432!important;*/
        /* couleur de fond pour l'élément surligné */
    }
</style>