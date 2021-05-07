Vue.component
(
    "basic-calculations-list", 
    {
        props: ["basic_calculations"], 
        template: 
        `
            <div>
                <ul class="list-unstyled pt-4">
                    <li class="basic-calculations-unit-li" v-for="{id, name} in basic_calculations">
                        <span>{{name}}</span>
                        <div class="buttons">
                            <button class="edit" title="Edit" @click="$emit('general-edit-button', id, name)" ><i class="far fa-edit"></i></button>
                            <button class="remove" title="Remove" @click="$emit('delete-basic-unit', id)"><i class="fa fa-trash-alt"></i></button>
                        </div>
                    </li>
                </ul>
            </div>
        `
    }
); 