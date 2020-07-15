Vue.component
(
    "id-tickbox", 
    {
        props: ["object_id"], 
        data()
        {
            return {
                value: false
            }
        }, 
        template: `<input type="checkbox" v-model="value" @change="$emit('id-check-changed', object_id, value)">`
    }
); 