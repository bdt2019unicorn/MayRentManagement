Vue.component 
(
    "overview", 
    {
        mixins:[support_mixin, table_actions_mixin], 
        data: ()=>
        (
            {
                table_actions: {}, 
                table_data: [] 
            }
        ), 
        components: {...bootstrap}, 
        created() 
        {
            this.PopulateData(); 
        },
        methods: 
        {
            ExportExcel()
            {
                if(!this.table_data.length)
                {
                    return; 
                }

                let hidden_columns = this.table_actions.hidden_columns||[];
                var worksheet = this.ExcelSheet(this.table_data, hidden_columns); 
                let page_title = this.table_actions.page_title||'Overview'; 
                var workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, page_title);
                XLSX.writeFile(workbook, `${page_title}.xlsx`);
            }, 
            PopulateData()
            {
                this.ResetValue
                (
                    {
                        value_name: "table_data", 
                        new_value: this.TableData(this.CurrentController), 
                        undefined_value: [], 
                        callback_resolve: ()=>
                        {
                            this.table_actions = this.TableActions(this.CurrentController); 
                            this.check_array = []; 
                        }
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
                            <vs-col v-if="table_data.length" vs-w="3" vs-type="flex" vs-align="flex-end" vs-justify="flex-end">
                                <vs-button color="success" type="gradient" icon="table_view" @click="ExportExcel">Export Excel</vs-button>
                            </vs-col>
                        </vs-row>    
                    </vs-col>
                </vs-row>
                
                <br>
                <vs-row v-if="table_data.length" vs-align="center" vs-justify="center" vs-type="flex">
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