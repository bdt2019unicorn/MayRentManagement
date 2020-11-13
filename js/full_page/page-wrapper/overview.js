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
            ExportExcel()
            {
                console.log(this.table_data); 
                console.log(this.table_actions); 

                if(!this.table_data.length)
                {
                    return; 
                }

                let hidden_collumns = this.table_actions.hidden_columns||[];
                let header = Object.keys(this.table_data[0]).filter(column=>!hidden_collumns.includes(column)); 

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
                <vs-row vs-align="center" vs-justify="center" vs-type="flex">    
                    <vs-col vs-w="11">
                        <vs-row>
                            <vs-col vs-w="9">
                                <h1>{{table_actions.page_title || "Overview"}} </h1>
                            </vs-col>
                            <vs-col v-if="table_data.length>0" vs-w="3" vs-type="flex" vs-align="flex-end" vs-justify="flex-end">
                                <vs-button color="success" type="gradient" icon="table_view" @click="ExportExcel">Export Excel</vs-button>
                            </vs-col>
                        </vs-row>    
                    </vs-col>
                </vs-row>
                
                
                <br>
                <vs-row v-if="table_data.length>0" vs-align="center" vs-justify="center" vs-type="flex">
                    <vs-col vs-w="11">
                        <scrolling-table v-bind="$data" @on-selected-rows-change="IdCheckChanged(arguments[0].selectedRows, table_actions.id)">
                            <table-actions 
                                v-if="CurrentController!='overview'" 
                                slot="table-actions"
                                :action="table_actions.edit_action || 'edit'"
                                :check_array="check_array"
                                :controller="CurrentController"
                                @delete-success="PopulateData"
                            ></table-actions>
                        </scrolling-table>
                    </vs-col>
                </vs-row>
            </div>
        `
    }
); 