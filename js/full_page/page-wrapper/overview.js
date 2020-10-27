Vue.component 
(
    "overview", 
    {
        mixins:[support_mixin], 
        data()
        {
            return {
                table_actions: {}, 
                table_data: [], 
                check_array: [] 
            }; 
        }, 
        components: {...vueFragment, ...bootstrap}, 
        created() 
        {
            this.PopulateData(); 
        },
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
            }, 
            IdCheckChanged(selected_rows)
            {
                let filter_by = this.table_actions.id; 
                this.check_array = selected_rows.map(row=>row[filter_by]); 
            }, 
            PopulateData()
            {
                new Promise
                (
                    (resolve, reject)=>
                    {
                        this.table_data = []; 
                        resolve(); 
                    }
                ).then 
                (
                    ()=>
                    {
                        this.table_data = this.TableData(this.CurrentController); 
                        this.table_actions = this.TableActions(this.CurrentController); 
                        this.check_array = []; 
                    }
                ); 

            } 
        },
        watch: 
        {
            $route(to, from)
            {
                this.PopulateData(); 
            }
        },
        template: 
        `
            <div class="container-fluid">
                <h1>{{table_actions.page_title || "Overview"}}</h1>
                <vs-row v-if="table_data.length>0" vs-align="center" vs-justify="center" vs-type="flex">
                    <vs-col vs-w="11">
                        <scrolling-table v-bind="$data" @on-selected-rows-change="IdCheckChanged(arguments[0].selectedRows)">
                            <vs-row vs-type="flex" vs-align="space-between" slot="table-actions" v-if="CurrentController!='overview'">
                                <b-button variant="danger" class="mx-1" :disabled="check_array.length==0" @click="DeleteData">Delete</b-button>
                                <b-button class="mx-1" disabled v-if="check_array.length!=1">Edit</b-button>
                                <router-link 
                                    class="btn btn-secondary mx-1" 
                                    v-else 
                                    :to="ToActions({action: table_actions.edit_action || 'edit', query: {id: check_array[0]}})"
                                >Edit</router-link>
                            </vs-row>
                        </scrolling-table>
                    </vs-col>
                </vs-row>
            </div>
        `
    }
); 