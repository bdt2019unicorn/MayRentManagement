Vue.component
(
    "scrolling-table", 
    {
        props: ["table_actions", "table_data"], 
        mixins: [support_mixin], 
        data() 
        {
            return {
                thead: {}, 
                tbody: []
            };
        }, 
        components: {...vueGoodTable, ...vueFragment, ...bootstrap}, 
        computed: 
        {
            IdTickbox()
            {
                try 
                {
                    return(this.table_actions.id)?this.thead[this.table_actions.id]:undefined; 
                }
                catch 
                {
                    return undefined; 
                }
            }, 
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
            this.SetupTable();   
        }, 
        methods: 
        {
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

// {
        /*
        {
            RouterLinkBind(index, row)
            {
                
                BindingKeys = ()=>
                {
                    var special_columns = this.table_actions["hyperlink"];
                    var keys = Object.keys(special_columns); 
                    for(var i=0; i<keys.length; i++)
                    {
                        if(this.thead[keys[i]]==index)
                        {
                            return special_columns[keys[i]]; 
                        }
                    }
                }

                let hyperlink_object = BindingKeys(); 
                let object_id = row[this.thead[hyperlink_object["object_id"]]]; 
                return {
                    ...hyperlink_object, 
                    append: hyperlink_object.append!=undefined?hyperlink_object.append: true, 
                    to: 
                    {
                        path: hyperlink_object.to, 
                        query: 
                        {
                            id: object_id
                        }
                    }
                }; 
            }, 
            SetupTable()
            {
                THead = ()=>
                {
                    this.thead = {}; 
                    if(this.table_data[0])
                    {
                        let index = 0; 
                        for(var key of Object.keys(this.table_data[0]))
                        {
                            if(!this.thead[key])
                            {
                                this.thead[key] = index++; 
                            }
                        }
                    }
                }

                TBody = ()=>
                {
                    this.tbody = []; 
                    if(this.thead!={})
                    {
                        this.table_data.forEach
                        (
                            row => 
                            {
                                let data_row = Array(Object.keys(this.thead).length).fill(" "); 
                                for(var key of Object.keys(row))
                                {
                                    data_row[this.thead[key]] = row[key]; 
                                }
                                this.tbody.push(data_row); 
                            }
                        );
                    }
                }

                THead(); 
                TBody(); 
            }, 
            SortTable(key, script)
            {
                function Swap(items, leftIndex, rightIndex)
                {
                    var temp = items[leftIndex];
                    items[leftIndex] = items[rightIndex];
                    items[rightIndex] = temp;
                }
                Partition = (items, left, right) =>
                {
                    var pivot   = Number(items[Math.floor((right + left) / 2)][key]), 
                        i       = left, 
                        j       = right;
                    while (i <= j) 
                    {
                        eval(script); 
                        if (i <= j) 
                        {
                            Swap(items, i, j); 
                            i++;
                            j--;
                        }
                    }
                    return i;
                }
                
                function QuickSort(items, left, right) 
                {
                    var index;
                    if (items.length > 1) 
                    {
                        index = Partition(items, left, right); 
                        if (left < index - 1) 
                        { 
                            QuickSort(items, left, index - 1);
                        }
                        if (index < right) 
                        { 
                            QuickSort(items, index, right);
                        }
                    }
                    return items;
                }
                this.tbody = QuickSort(this.tbody, 0, this.tbody.length-1).reverse(); 
            }, 
            SpecialColumnsIndexes(action, supper_special=true)
            {
                try 
                {
                    var special_columns = this.table_actions[action];
                    var index_object = {}; 
                    Object.keys(special_columns).forEach
                    (   
                        element => 
                        {
                            if(supper_special)
                            {
                                index_object[(this.thead[element])?element:special_columns[element]] = this.thead[special_columns[element]]; 
                            }
                            else 
                            {
                                index_object[element] = this.thead[element]; 
                            }
                        }
                    );
                    return index_object; 
                }
                catch
                {
                    return {}; 
                }
            }

        }
        */
// }


        },
        // watch: 
        // {
        //     table_data: function()
        //     {
        //         this.SetupTable(); 
        //     }
        // }, 
        template: 
        `
            <vue-good-table v-bind="DisplayTable" v-on="$listeners">
                
                <template slot="table-actions">
                    <slot name="table-actions"></slot>
                </template>

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
        ` 
    }
); 

/*
Vue.component
(
    "scrolling-table", 
    {
        props: ["table_actions", "table_data", "tb_style"], 
        mixins: [support_mixin], 
        data() 
        {
            return {
                thead: {}, 
                tbody: []
            };
        }, 
        computed: 
        {
            IdTickbox()
            {
                try 
                {
                    return(this.table_actions.id)?this.thead[this.table_actions.id]:undefined; 
                }
                catch 
                {
                    return undefined; 
                }
            }
        },
        created() 
        {
            this.SetupTable();   
        }, 
        methods: 
        {
            RouterLinkBind(index, row)
            {
                
                BindingKeys = ()=>
                {
                    var special_columns = this.table_actions["hyperlink"];
                    var keys = Object.keys(special_columns); 
                    for(var i=0; i<keys.length; i++)
                    {
                        if(this.thead[keys[i]]==index)
                        {
                            return special_columns[keys[i]]; 
                        }
                    }
                }

                let hyperlink_object = BindingKeys(); 
                let object_id = row[this.thead[hyperlink_object["object_id"]]]; 
                return {
                    ...hyperlink_object, 
                    append: hyperlink_object.append!=undefined?hyperlink_object.append: true, 
                    to: 
                    {
                        path: hyperlink_object.to, 
                        query: 
                        {
                            id: object_id
                        }
                    }
                }; 
            }, 
            SetupTable()
            {
                THead = ()=>
                {
                    this.thead = {}; 
                    if(this.table_data[0])
                    {
                        let index = 0; 
                        for(var key of Object.keys(this.table_data[0]))
                        {
                            if(!this.thead[key])
                            {
                                this.thead[key] = index++; 
                            }
                        }
                    }
                }

                TBody = ()=>
                {
                    this.tbody = []; 
                    if(this.thead!={})
                    {
                        this.table_data.forEach
                        (
                            row => 
                            {
                                let data_row = Array(Object.keys(this.thead).length).fill(" "); 
                                for(var key of Object.keys(row))
                                {
                                    data_row[this.thead[key]] = row[key]; 
                                }
                                this.tbody.push(data_row); 
                            }
                        );
                    }
                }

                THead(); 
                TBody(); 
            }, 
            SortTable(key, script)
            {
                function Swap(items, leftIndex, rightIndex)
                {
                    var temp = items[leftIndex];
                    items[leftIndex] = items[rightIndex];
                    items[rightIndex] = temp;
                }
                Partition = (items, left, right) =>
                {
                    var pivot   = Number(items[Math.floor((right + left) / 2)][key]), 
                        i       = left, 
                        j       = right;
                    while (i <= j) 
                    {
                        eval(script); 
                        if (i <= j) 
                        {
                            Swap(items, i, j); 
                            i++;
                            j--;
                        }
                    }
                    return i;
                }
                
                function QuickSort(items, left, right) 
                {
                    var index;
                    if (items.length > 1) 
                    {
                        index = Partition(items, left, right); 
                        if (left < index - 1) 
                        { 
                            QuickSort(items, left, index - 1);
                        }
                        if (index < right) 
                        { 
                            QuickSort(items, index, right);
                        }
                    }
                    return items;
                }
                this.tbody = QuickSort(this.tbody, 0, this.tbody.length-1).reverse(); 
            }, 
            SpecialColumnsIndexes(action, supper_special=true)
            {
                try 
                {
                    var special_columns = this.table_actions[action];
                    var index_object = {}; 
                    Object.keys(special_columns).forEach
                    (   
                        element => 
                        {
                            if(supper_special)
                            {
                                index_object[(this.thead[element])?element:special_columns[element]] = this.thead[special_columns[element]]; 
                            }
                            else 
                            {
                                index_object[element] = this.thead[element]; 
                            }
                        }
                    );
                    return index_object; 
                }
                catch
                {
                    return {}; 
                }
            }
        },
        watch: 
        {
            table_data: function()
            {
                this.SetupTable(); 
            }
        }, 
        template: 
        `
            <div :class="['scrolling-div', 'table-responsive', 'container-fluid']" :style="tb_style">
                <table ref='main_table' class="table table-striped table-bordered table-hover">
                    <thead class="thead-dark">
                        <tr>
                            <th v-for="key in Object.keys(thead)" :key="key" v-if='SpecialColumnsIndexes("hidden_columns")[key]==undefined' :class="StateObject('table_th_sticky')?'sticky-top':undefined">
                                <a-sort-table v-if='SpecialColumnsIndexes("sort")[key]!=undefined' :text="key" :index='SpecialColumnsIndexes("sort")[key]'@sort-table="SortTable"></a-sort-table>
                                <template v-else>{{key}}</template>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="row in tbody">
                            <td v-for="index in row.length" :key="index-1" v-if='!Object.values(SpecialColumnsIndexes("hidden_columns")).includes(index-1)'>
                                <id-tickbox v-if="(index-1)==IdTickbox" :object_id="row[index-1]" v-on="$listeners"></id-tickbox>

                                <router-link
                                    v-else-if='Object.values(SpecialColumnsIndexes("hyperlink", false)).includes(index-1)'
                                    v-bind="RouterLinkBind(index-1, row)"
                                >{{row[index-1]}}</router-link>

                                <hyperlink-list-compile v-else-if='Object.values(SpecialColumnsIndexes("hyperlink_list")).includes(index-1)' :list="row[index-1]"></hyperlink-list-compile>

                                <template v-else>{{row[index-1]}}</template>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        ` 
    }
); 

*/



