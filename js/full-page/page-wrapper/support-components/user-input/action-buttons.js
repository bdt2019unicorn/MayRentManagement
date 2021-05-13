Vue.component 
(
    "close-button", 
    {
        template: 
        `
            <div class="my-2 container-fluid text-right">
                <b-button pill title="Cancel" variant="danger" v-on="$listeners"><b-icon icon="x-circle"></b-icon></b-button>
            </div>
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
            ButtonBind()
            {
                return {
                    class: "float-right", 
                    color: "success", 
                    type: "flat", 
                    icon: this.show_details?"remove": "add", 
                    title: (this.show_details?"Hide ": "Show ") + "Details"
                }
            }
        },
        template: `<vs-button v-bind="ButtonBind" v-on="$listeners"></vs-button>`
    }
); 

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
