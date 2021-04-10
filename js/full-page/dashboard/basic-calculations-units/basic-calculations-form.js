Vue.component
(
    "basic-calculations-form", 
    {
        props: ["edit_id"], 
        mixins: [v_model_mixin], 
        template: 
        `
            <div>
                <form class="container-fluid" @submit="$listeners['submit']">
                    <div class="row pb-2">
                        <div class="col-10">
                            <input name="name" class="basic-calculations-unit-add-input" type="text" v-model="content">
                        </div>
                        <div class="col-2">
                            <button type="submit" class="btn btn-success ml-1 mr-1 p-1 rounded-circle"><i :class="(edit_id?'fas fa-check-double': 'fa fa-plus')"></i></button>
                            <button type="button" class="btn btn-danger ml-1 mr-1 p-1 rounded-circle" @click="$listeners['click']"><i class="fa fa-times"></i></button>
                        </div>
                    </div>
                    <slot></slot>
                </form>
            </div>
        `
    }
); 