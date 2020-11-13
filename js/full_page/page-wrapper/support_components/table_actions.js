Vue.component 
(
    "table-actions", 
    {
        props: ["action", "check_array", "controller"], 
        mixins:[support_mixin], 
        components: {...bootstrap}, 
        methods: 
        {
            DeleteData()
            {
                var url = `server/database_controller/delete.php?table=${this.CurrentController}`; 
                var result = this.SubmitData("delete", url, this.check_array); 
                if(Number(result))
                {
                    alert("Delete success!"); 
                    this.$emit("delete-success"); 
                }
                else
                {
                    alert("Delete fails, there seems to be a server error"); 
                }
            }, 
            DeleteDuplicate()
            {
                var url = `server/database_controller/delete_duplicate.php?controller=${this.CurrentController}`; 
                var result = this.AjaxRequest(url); 
                if(result)
                {
                    alert("All duplicate values deleted"); 
                    this.$emit("delete-success"); 
                }
                else 
                {
                    alert("Delete duplicates values fails, please try again"); 
                }
            }
        },
        template: 
        `
            <vs-row vs-type="flex" vs-align="space-between">
                <b-button variant="light" @click="DeleteDuplicate">Delete Duplicates</b-button>
                <b-button variant="danger" class="mx-1" :disabled="check_array.length==0" @click="DeleteData">Delete</b-button>
                <b-button class="mx-1" disabled v-if="check_array.length!=1">Edit</b-button>
                <router-link 
                    class="btn btn-secondary mx-1" 
                    v-else 
                    :to="$attrs.to||ToActions({action: action, query: {id: check_array[0]}})"
                >Edit</router-link>
            </vs-row>
        `
    }
); 