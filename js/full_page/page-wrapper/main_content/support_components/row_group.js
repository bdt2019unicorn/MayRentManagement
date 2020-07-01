var row_group = Vue.component
(
    "row-group", 
    {
        props: ["row","just_started_parent", "controller"], 
        template: 
        `
            <div class="row">
                <component 
                    v-for="col in row"
                    :is="col.component"
                    v-bind="col"
                    :just_started_parent="just_started_parent"
                    :controller="controller"
                >
                </component>

            </div>
        `    
    }
);