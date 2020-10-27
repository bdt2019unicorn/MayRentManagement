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
        components: {...vueGoodTable, ...vueFragment, ...bootstrap}, 
        computed: 
        {
            DisplayTable()
            {
                return (this.table_data.length==0)? undefined: 
                {
                    columns: Object.keys(this.table_data[0]).filter
                    (
                        column=>
                        {
                            return !this.SpecialColumns("hidden_columns").includes(column); 
                        }
                    ).map
                    (
                        column=>
                        {
                            let sort_actions = this.SpecialColumns("sort"); 

                            SortFunction = (row1_value, row2_value, col, row1_object, row2_object)=>
                            {
                                let sort_by = sort_actions[column]; 
                                let result = Number(row1_object[sort_by]) - Number(row2_object[sort_by]); 
                                return result==0? 0: (result/Math.abs(result)); 
                            }; 

                            let sort = !Object.keys(sort_actions).includes(column)? {sortable: false}: 
                            {
                                sortable: true,
                                sortFn: SortFunction 
                            }

                            return {
                                field: column, 
                                label: column, 
                                thClass: 'text-center', 
                                filterOptions: {enabled: this.table_actions.search.includes(column)}, 
                                ...sort 
                            }
                        }                    
                    ), 
                    rows: this.table_data, 
                    theme: "black-rhino", 
                    styleClass: "vgt-table bordered striped", 
                    searchOptions: {enabled: true}, 
                    maxHeight: "80vh", 
                    fixedHeader: true, 
                    selectOptions: 
                    {
                        enabled: Boolean(this.table_actions.id), 
                        disableSelectInfo: true
                    }
                }
            }    
        },
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

            }, 
            RouterLinkBind(column, row)
            {
                let hyperlink_object = this.SpecialColumns("hyperlink"); 
                try
                {
                    hyperlink_object = hyperlink_object[column]; 
                    return {
                        ...hyperlink_object, 
                        append: hyperlink_object.append!=undefined?hyperlink_object.append: true, 
                        to: 
                        {
                            path: hyperlink_object.to, 
                            query: 
                            {
                                id: row[hyperlink_object["object_id"]]
                            }
                        }
                    }
                }
                catch 
                {
                    return {}; 
                }
            }, 
            SpecialColumns(action)
            {
                return this.table_actions[action]||[]; 
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
                <vs-row v-if="DisplayTable" vs-align="center" vs-justify="center" vs-type="flex">
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


/*

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
        components: {...vueGoodTable, ...vueFragment, ...bootstrap}, 
        computed: 
        {
            DisplayTable()
            {
                return (this.table_data.length==0)? undefined: 
                {
                    columns: Object.keys(this.table_data[0]).filter
                    (
                        column=>
                        {
                            return !this.SpecialColumns("hidden_columns").includes(column); 
                        }
                    ).map
                    (
                        column=>
                        {
                            let sort_actions = this.SpecialColumns("sort"); 

                            SortFunction = (row1_value, row2_value, col, row1_object, row2_object)=>
                            {
                                let sort_by = sort_actions[column]; 
                                let result = Number(row1_object[sort_by]) - Number(row2_object[sort_by]); 
                                return result==0? 0: (result/Math.abs(result)); 
                            }; 

                            let sort = !Object.keys(sort_actions).includes(column)? {sortable: false}: 
                            {
                                sortable: true,
                                sortFn: SortFunction 
                            }

                            return {
                                field: column, 
                                label: column, 
                                thClass: 'text-center', 
                                filterOptions: {enabled: this.table_actions.search.includes(column)}, 
                                ...sort 
                            }
                        }                    
                    ), 
                    rows: this.table_data, 
                    theme: "black-rhino", 
                    styleClass: "vgt-table bordered striped", 
                    searchOptions: {enabled: true}, 
                    maxHeight: "80vh", 
                    fixedHeader: true, 
                    selectOptions: 
                    {
                        enabled: Boolean(this.table_actions.id), 
                        disableSelectInfo: true
                    }
                }
            }    
        },
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

            }, 
            RouterLinkBind(column, row)
            {
                let hyperlink_object = this.SpecialColumns("hyperlink"); 
                try
                {
                    hyperlink_object = hyperlink_object[column]; 
                    return {
                        ...hyperlink_object, 
                        append: hyperlink_object.append!=undefined?hyperlink_object.append: true, 
                        to: 
                        {
                            path: hyperlink_object.to, 
                            query: 
                            {
                                id: row[hyperlink_object["object_id"]]
                            }
                        }
                    }
                }
                catch 
                {
                    return {}; 
                }
            }, 
            SpecialColumns(action)
            {
                return this.table_actions[action]||[]; 
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
                <vs-row v-if="DisplayTable" vs-align="center" vs-justify="center" vs-type="flex">
                    <vs-col vs-w="11">
                        <vue-good-table v-bind="DisplayTable" @on-selected-rows-change="IdCheckChanged(arguments[0].selectedRows)">
                            <vs-row vs-type="flex" vs-align="space-between" slot="table-actions" v-if="CurrentController!='overview'">
                                <b-button variant="danger" class="mx-1" :disabled="check_array.length==0" @click="DeleteData">Delete</b-button>
                                <b-button class="mx-1" disabled v-if="check_array.length!=1">Edit</b-button>
                                <router-link 
                                    class="btn btn-secondary mx-1" 
                                    v-else 
                                    :to="ToActions({action: table_actions.edit_action || 'edit', query: {id: check_array[0]}})"
                                >Edit</router-link>
                            </vs-row>

                            <template slot="table-row" slot-scope="props">
                                <hyperlink-list-compile v-if='SpecialColumns("hyperlink_list").includes(props.column.field)' :list="props.row[props.column.field]"></hyperlink-list-compile>

                                <router-link
                                    v-else-if='Object.keys(SpecialColumns("hyperlink")).includes(props.column.field)'
                                    v-bind="RouterLinkBind(props.column.field, props.row)"
                                >{{props.formattedRow[props.column.field]}}</router-link>

                                <template v-else>
                                    {{props.formattedRow[props.column.field]}}
                                </template>
                            </template>

                        </vue-good-table>
                    </vs-col>
                </vs-row>
            </div>
        `
    }
); 


*/



