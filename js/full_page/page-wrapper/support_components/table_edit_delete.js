Vue.component 
(
    "overview", 
    {
        props: ["action", "check_array"], 
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
                    this.PopulateData(); 
                }
                else
                {
                    alert("Delete fails, there seems to be a server error"); 
                }
            }
        },
        template: 
        `
            <vs-row vs-type="flex" vs-align="space-between">
                <b-button variant="danger" class="mx-1" :disabled="check_array.length==0" @click="DeleteData">Delete</b-button>
                <b-button class="mx-1" disabled v-if="check_array.length!=1">Edit</b-button>
                <router-link 
                    class="btn btn-secondary mx-1" 
                    v-else 
                    :to="ToActions({action: action, query: {id: check_array[0]}})"
                >Edit</router-link>
            </vs-row>
        `
    }
); 