Vue.component 
(
    "overview", 
    {
        mixins:[support_mixin, table_actions_mixin], 
        data()
        {
            return {
                table_actions: {}, 
                table_data: [] 
            }; 
        }, 
        components: {...bootstrap}, 
        created() 
        {
            this.PopulateData(); 
        },
        methods: 
        {
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
                        <scrolling-table v-bind="$data" @on-selected-rows-change="IdCheckChanged(arguments[0].selectedRows, table_actions.id)">
                            <table-edit-delete 
                                v-if="CurrentController!='overview'" 
                                slot="table-actions"
                                :action="table_actions.edit_action || 'edit'"
                                :check_array="check_array"
                                :controller="CurrentController"
                                @delete-success="PopulateData"
                            ></table-edit-delete>
                        </scrolling-table>
                    </vs-col>
                </vs-row>
            </div>
        `
    }
); 