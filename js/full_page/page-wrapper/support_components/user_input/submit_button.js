Vue.component
(
    "submit-button", 
    {
        props: ["icon", "title", "type"], 
        template: 
        `
            <button :type="type||'button'" class="btn" :title="title" @click="$emit('submit-button-clicked')">
                <i style="font-size: xx-large;" :class="'fas fa-'+ (icon||'arrow-alt-circle-right')"></i>
            </button>
        `
    }
); 