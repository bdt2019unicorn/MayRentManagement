Vue.component
(
    "text-input", 
    {
        props: ["edit_data", "id", "name", "title", "type"], 
        mixins: [text_mixin], 
        computed: 
        {
            InputType()
            {
                return this.type?this.type: "text"; 
            }
        }, 
        template: 
        `
            <div class="form-group col">
                <label :for="name" v-if="title"><b>{{title}}</b></label>
                <input class="form-control" :type="InputType" :name="name" :id="id" v-model="value">
            </div>
        `
    }
); 

Vue.component
(
    "text-group-confirmation", 
    {
        props: ["confirm_name", "confirm_title", "id", "name", "title"], 
        template: 
        `
            <div class="form-group col">
                <div class="row">
                    <text-input :name="name" :title="title":id="id"></text-input>
                    <text-input :name="confirm_name" :title="confirm_title"></text-input>
                </div>
            </div>
        `
    }
); 

Vue.component
(
    "textarea-input", 
    {
        props: ["edit_data", "name", "title"],
        mixins: [text_mixin],  
        template: 
        `
            <div class="form-group col">
                <label :for="name"><b>{{title}}</b></label>
                <textarea class="form-control" :name="name" v-model="value"></textarea>
            </div>
        `
    }
); 