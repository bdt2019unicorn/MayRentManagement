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
                check_array: [], 
                scrolling_table: true 
            }; 
        }, 
        components: {...vueGoodTable, ...vueFragment}, 
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
                            FilterOptions = (column)=>
                            {
                                try 
                                {
                                    return this.table_actions.search.includes(column)? {enabled: true}: undefined; 
                                }
                                catch 
                                {
                                    return undefined; 
                                }
                            }; 

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
                                filterOptions: FilterOptions(column), 
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
                        enabled: this.CurrentController!='overview'
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
                    new Promise
                    (
                        (resolve, reject)=>
                        {
                            this.scrolling_table = false; 
                            this.PopulateData(); 
                            resolve(); 
                        }
                    ).then 
                    (
                        ()=>
                        {
                            this.scrolling_table = true; 
                        }
                    ); 
                }
                else
                {
                    alert("Delete fails, there seems to be a server error"); 
                }
            }, 
            IdCheckChanged(object_id, checked)
            {
                if(checked)
                {
                    this.check_array.push(object_id); 
                }
                else 
                {
                    this.check_array = this.check_array.filter(value=>value!=object_id); 
                }
            }, 
            PopulateData()
            {
                this.table_data = this.TableData(this.CurrentController); 
                this.table_actions = this.TableActions(this.CurrentController); 
                this.check_array = []; 
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
            Search()
            {
                let data = $(this.$refs['search_form']).serializeObject(); 
                let overview_data = this.TableData(this.CurrentController); 
                if(data['search_value'])
                {
                    this.table_data = overview_data.filter 
                    (
                        row=>
                        {
                            function CheckRow()
                            {
                                for(var value of Object.values(row))
                                {
                                    try 
                                    {
                                        if(value.toLowerCase().indexOf(data['search_value'].toLowerCase())>=0)
                                        {
                                            return true; 
                                        }
                                    }
                                    catch{}
                                }
                                return false; 
                            }

                            function CheckCategory()
                            {
                                try 
                                {
                                    return (row[data['search_category']].toLowerCase().indexOf(data['search_value'].toLowerCase())>=0); 
                                }
                                catch 
                                {
                                    return false; 
                                }
                            }
                            return (data['search_category'])? CheckCategory() : CheckRow(); 
                        }
                    ); 
                    return; 
                }
                this.table_data = overview_data; 
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
                        this.PopulateData(); 
                    }
                ); 
            }
        },
        template: 
        `
            <div class="container-fluid">
                <h1>{{table_actions.page_title || "Overview"}}</h1>
                <vs-row v-if="DisplayTable" vs-align="center" vs-justify="center" vs-type="flex">
                    <vs-col vs-w="11">
                        <vue-good-table v-bind="DisplayTable">
                            <div slot="table-actions" v-if="CurrentController!='overview'">
                                This will show up on the top right of the table. 
                            </div>

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
        <!--
            <div class="container-fluid">
                <h1>{{table_actions.page_title || "Overview"}}</h1>
                <div class="row">
                    <form class="container-fluid row col" v-if="table_actions.search" ref="search_form" @submit.prevent="Search">
                        <text-input name='search_value'></text-input>
                        <select-input 
                            name='search_category' 
                            v-if="table_actions.search.length>0" 
                            :select_data="table_actions.search?table_actions.search.map(element=>({value: element, text: element})): undefined" 
                            select_value="value" 
                            text="text" 
                            not_required="true"
                        ></select-input>
                        <div class="col--2"> 
                            <button class="btn btn-primary" type="submit">Search</button>
                        </div>
                    </form>

                    <div class="col-4 row" v-if="CurrentController!='overview'">

                        <div class="col text-right">
                            <button :disabled="check_array.length==0" class="btn btn-danger" type="button" @click="DeleteData">Delete</button>
                        </div>
                        <div class="col text-center">
                            <button class="btn btn-secondary" v-if="check_array.length!=1" disabled>Edit</button>
                            <router-link 
                                class="btn btn-secondary" 
                                v-else 
                                :to="ToActions({action: table_actions.edit_action || 'edit', query: {id: check_array[0]}})"
                            >Edit</router-link>
                        </div>

                    </div>
                </div>
                <br>
                <scrolling-table v-if="scrolling_table" class="row" v-bind="$data" @id-check-changed="IdCheckChanged"></scrolling-table>
            </div>
            -->


        `
    }
); 

// template: 
//         `
//             <div class="container-fluid">
//                 <h1>{{table_actions.page_title || "Overview"}}</h1>
//                 <div class="row">
//                     <form class="container-fluid row col" v-if="table_actions.search" ref="search_form" @submit.prevent="Search">
//                         <text-input name='search_value'></text-input>
//                         <select-input 
//                             name='search_category' 
//                             v-if="table_actions.search.length>0" 
//                             :select_data="table_actions.search?table_actions.search.map(element=>({value: element, text: element})): undefined" 
//                             select_value="value" 
//                             text="text" 
//                             not_required="true"
//                         ></select-input>
//                         <div class="col--2"> 
//                             <button class="btn btn-primary" type="submit">Search</button>
//                         </div>
//                     </form>

//                     <div class="col-4 row" v-if="CurrentController!='overview'">

//                         <div class="col text-right">
//                             <button :disabled="check_array.length==0" class="btn btn-danger" type="button" @click="DeleteData">Delete</button>
//                         </div>
//                         <div class="col text-center">
//                             <button class="btn btn-secondary" v-if="check_array.length!=1" disabled>Edit</button>
//                             <router-link 
//                                 class="btn btn-secondary" 
//                                 v-else 
//                                 :to="ToActions({action: table_actions.edit_action || 'edit', query: {id: check_array[0]}})"
//                             >Edit</router-link>
//                         </div>

//                     </div>
//                 </div>
//                 <br>
//                 <scrolling-table v-if="scrolling_table" class="row" v-bind="$data" @id-check-changed="IdCheckChanged"></scrolling-table>
//             </div>
//         `
//     }





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
                check_array: [], 
                scrolling_table: true 
            }; 
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
                    new Promise
                    (
                        (resolve, reject)=>
                        {
                            this.scrolling_table = false; 
                            this.PopulateData(); 
                            resolve(); 
                        }
                    ).then 
                    (
                        ()=>
                        {
                            this.scrolling_table = true; 
                        }
                    ); 
                }
                else
                {
                    alert("Delete fails, there seems to be a server error"); 
                }
            }, 
            IdCheckChanged(object_id, checked)
            {
                if(checked)
                {
                    this.check_array.push(object_id); 
                }
                else 
                {
                    this.check_array = this.check_array.filter(value=>value!=object_id); 
                }
            }, 
            PopulateData()
            {
                this.table_data = this.TableData(this.CurrentController); 
                this.table_actions = this.TableActions(this.CurrentController); 
                this.check_array = []; 
            }, 
            Search()
            {
                let data = $(this.$refs['search_form']).serializeObject(); 
                let overview_data = this.TableData(this.CurrentController); 
                if(data['search_value'])
                {
                    this.table_data = overview_data.filter 
                    (
                        row=>
                        {
                            function CheckRow()
                            {
                                for(var value of Object.values(row))
                                {
                                    try 
                                    {
                                        if(value.toLowerCase().indexOf(data['search_value'].toLowerCase())>=0)
                                        {
                                            return true; 
                                        }
                                    }
                                    catch{}
                                }
                                return false; 
                            }

                            function CheckCategory()
                            {
                                try 
                                {
                                    return (row[data['search_category']].toLowerCase().indexOf(data['search_value'].toLowerCase())>=0); 
                                }
                                catch 
                                {
                                    return false; 
                                }
                            }
                            return (data['search_category'])? CheckCategory() : CheckRow(); 
                        }
                    ); 
                    return; 
                }
                this.table_data = overview_data; 
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
                <div class="row">
                    <form class="container-fluid row col" v-if="table_actions.search" ref="search_form" @submit.prevent="Search">
                        <text-input name='search_value'></text-input>
                        <select-input 
                            name='search_category' 
                            v-if="table_actions.search.length>0" 
                            :select_data="table_actions.search?table_actions.search.map(element=>({value: element, text: element})): undefined" 
                            select_value="value" 
                            text="text" 
                            not_required="true"
                        ></select-input>
                        <div class="col--2"> 
                            <button class="btn btn-primary" type="submit">Search</button>
                        </div>
                    </form>

                    <div class="col-4 row" v-if="CurrentController!='overview'">

                        <div class="col text-right">
                            <button :disabled="check_array.length==0" class="btn btn-danger" type="button" @click="DeleteData">Delete</button>
                        </div>
                        <div class="col text-center">
                            <button class="btn btn-secondary" v-if="check_array.length!=1" disabled>Edit</button>
                            <router-link 
                                class="btn btn-secondary" 
                                v-else 
                                :to="ToActions({action: table_actions.edit_action || 'edit', query: {id: check_array[0]}})"
                            >Edit</router-link>
                        </div>

                    </div>
                </div>
                <br>
                <scrolling-table v-if="scrolling_table" class="row" v-bind="$data" @id-check-changed="IdCheckChanged"></scrolling-table>
            </div>
        `
    }
); 



*/