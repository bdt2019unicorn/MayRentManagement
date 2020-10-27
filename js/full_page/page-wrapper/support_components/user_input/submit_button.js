Vue.component
(
    "submit-button", 
    {
        props: ["icon", "type"], 
        template: 
        `
            <button :type="type||'button'" class="btn" @click="$emit('submit-button-clicked')">
                <i style="font-size: xx-large;" :class="'fas fa-'+ (icon||'arrow-alt-circle-right')"></i>
            </button>
        `
    }
); 