Vue.component
(
    "text-input", 
    {
        props: ["id", "type"], 
        mixins: [user_input_components_v_model_support_mixin], 
        template: 
        `
            <div class="form-group col">
                <label :for="name" v-if="title"><b>{{title}}</b></label>
                <input class="form-control" :style="LockStyle" :type="type||'text'" :name="name" :id="id" v-model="value">
            </div>
        `
    }
); 

Vue.component
(
    "text-group-confirmation", 
    {
        props: ["confirm_name", "confirm_title", "id"], 
        mixins: [user_input_support_mixin], 
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
        mixins: [user_input_components_v_model_support_mixin],  
        template: 
        `
            <div class="form-group col">
                <label :for="name"><b>{{title}}</b></label>
                <textarea class="form-control" :name="name" v-model="value"></textarea>
            </div>
        `
    }
); 