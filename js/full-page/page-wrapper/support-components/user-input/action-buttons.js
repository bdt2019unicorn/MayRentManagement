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

Vue.component
(
    "details-button", 
    {
        props: ["show_details"], 
        computed: 
        {
            ButtonBind: ()=>
            (
                {
                    class: "float-right", 
                    color: "success", 
                    type: "flat", 
                    icon: this.show_details?"remove": "add", 
                    title: (this.show_details?"Hide ": "Show ") + "Details"
                }
            )
        },
        template: `<vs-button v-bind="ButtonBind" v-on="$listeners"></vs-button>`
    }
); 