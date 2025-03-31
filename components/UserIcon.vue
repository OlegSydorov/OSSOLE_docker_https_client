<script setup lang="ts">
    import type User from '~/api/models/User';
  
    const props = defineProps({
        //firstName: {
        //    type: String,
        //    default: 'Un',
        //},
        //secondName: {
        //    type: String,
        //    default: 'Known',
        //},
        user: {
            type: Object as PropType<User>,
            required: true
},
        mode: {
            type: String,
        default:'',},
    })

    const abbr = computed(() => {      
    
        if (props.user) {
            return props.user.first_name[0] + props.user.last_name[0];
        }
        else {
            return '---';}
    })

    const fullName = computed(() => {
        
        //if (props.firstName && props.secondName) {
        //    return props.firstName[0] + props.secondName[0];
        //}
        if (props.user) {
            return props.user.first_name +" "+props.user.last_name;
        }
        else {
            return '-';
        }
    })


    const bgColor = computed(() => {
        if (props.user) {
            let rColor = Math.round(((props.user.first_name.charCodeAt(0) - 64) / 26) * 255);
            let gColor = Math.round(((props.user.last_name.charCodeAt(0) - 64) / 26) * 255);
            return 'rgb(' + rColor + ',' + gColor + ',125)';
        }
        else {
            return 'rgb(100, 100, 100)';
        }
    })   

    const txtColor = computed(() => {

        if (props.user) {
            let rColor = Math.round(((props.user.first_name.charCodeAt(0) - 64) / 26) * 255);
            let gColor = Math.round(((props.user.last_name.charCodeAt(0) - 64) / 26) * 255);
            let bColor = 125;

            rColor /= 255;
            gColor /= 255;
            bColor /= 255;

            let max = Math.max(rColor, gColor, bColor);
            let min = Math.min(rColor, gColor, bColor);

            let h, s, l = (max + min) / 2;

            if (max == min) {
                h = s = 0; // achromatic
            }
            else {
                var d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                switch (max) {
                    case rColor: h = (gColor - bColor) / d + (gColor < bColor ? 6 : 0); break;
                    case gColor: h = (bColor - rColor) / d + 2; break;
                    case bColor: h = (rColor - gColor) / d + 4; break;
                }
                h /= 6;
            }


            let finColor = l < 0.65 ? 'rgb(255, 255, 255)' : s < 0.5 ? 'rgb(255, 255, 255)' : 'rgb(0,0,0)';


            return finColor;
        }
        else {
            return 'rgb(200, 200, 200)';
        }

       
    })
</script>

<template>
    <div class="userIconClass" :style="{backgroundColor:bgColor, color:txtColor}">
        {{abbr}}
        <span v-if="props.mode=='table' " class="tooltiptext-table">{{fullName}}</span>
        <span v-else class="tooltiptext">{{props.mode}} {{fullName}}</span>
    </div>
</template>

<style scoped>
    .userIconClass {
        position: relative;
        width: fit-content;
        padding: 5px;
        border-radius: 20px;
        font-weight: bold;
       
    }

    .task-detail-item {
        position: relative;
    }

        /* Tooltip text */
    .userIconClass .tooltiptext {
        visibility: hidden;
        background-color: #18193a;
        width:120px;
        color: white;
        font-size: 0.75rem;
        font-weight: normal;
        padding: 1px;
        text-align: center;
        border-radius: 2px;
        border: 1px solid #312c63;
        /* Position the tooltip text */
        position: absolute;
        z-index: 1;
        bottom: 95%;
        right: 10px;
        /*  margin-left: -60px;*/
        /* Fade in tooltip */
        opacity: 0;
        transition: opacity 0.3s;
    }

    .userIconClass .tooltiptext-table {
        visibility: hidden;
        background-color: #18193a;
        width: fit-content;
        height: fit-content;
        color: white;
        font-size: 0.65rem;
        font-weight: normal;
        padding: 1px;
        text-align: center;
        border-radius: 2px;
        /* Position the tooltip text */
        position: absolute;
        z-index: 1;
        bottom: 0%;
        left: -50%;
        /*  margin-left: -60px;*/
        /* Fade in tooltip */
        opacity: 0;
        transition: opacity 0.3s;
    }

        /* Show the tooltip text when you mouse over the tooltip container */
    .userIconClass:hover .tooltiptext, .userIconClass:hover .tooltiptext-table {
        visibility: visible;
        opacity: 1.0;
    }


</style>
