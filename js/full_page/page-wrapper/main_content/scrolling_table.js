var scrolling_table = Vue.component
(
    "scrolling-table", 
    {
        props: ["tb_style", "table_data", "table_actions"], 
        data() 
        {
            return {
                thead: {}, 
                tbody: []
            };
        }, 
        computed: 
        {
            HiddenColums()
            {
                return this.SpecialColumnsIndexes("hidden_columns"); 
            },     
            SortColumns()
            {
                return this.SpecialColumnsIndexes("sort"); 
            }, 
            SearchColumns()
            {
                return this.SpecialColumnsIndexes("search"); 
            }
        },
        created() 
        {
            this.SetupTable();   
        }, 

        methods: 
        {
            SetupTable()
            {
                function THead(table_data)
                {
                    if(table_data!=[])
                    {
                        let thead = {}; 
                        let index = 0; 
                        table_data.forEach
                        (
                            row => 
                            {
                                for(var key of Object.keys(row))
                                {
                                    if(thead[key]==undefined)
                                    {
                                        thead[key] = index++; 
                                    }
                                }
                            }
                        );
                        return thead; 
                    }
                    return {}; 
                }

                function TBody(thead, table_data)
                {
                    if(thead=={})
                    {
                        return []; 
                    }
                    var tbody = []; 
                    table_data.forEach
                    (
                        row => 
                        {
                            let data_row = Array(Object.keys(thead).length).fill(" "); 
                            for(var key of Object.keys(row))
                            {
                                data_row[thead[key]] = row[key]; 
                            }
                            tbody.push(data_row); 
                        }
                    );
                    return tbody; 
                }

                this.thead = THead(this.table_data); 
                this.tbody = TBody(this.thead, this.table_data); 
            }, 
            SpecialColumnsIndexes(action)
            {
                try 
                {
                    var special_columns = this.table_actions[action];
                    var index_object = {}; 
                    Object.keys(special_columns).forEach
                    (   
                        element => 
                        {
                            index_object[(this.thead[element])?element:special_columns[element]] = this.thead[special_columns[element]]; 
                        }
                    );
                    return index_object; 
                }
                catch
                {
                    return {}; 
                }
            }, 
            SortTable(key)
            {
                console.log(key); 
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
            <div 
                :class="['scrolling-div', 'table-responsive', 'container-fluid']"
                :style="tb_style"
            >
                <table ref='main_table' class="table table-striped table-bordered table-hover">
                    <thead class="thead-dark">
                        <tr>
                            <th 
                                v-for="key in Object.keys(thead)" 
                                :key="key"
                                v-if="!HiddenColums[key]"
                                class="sticky-top"
                            >
                                <a 
                                    href="javascript:void(0);" 
                                    class="text-white" 
                                    v-if="SortColumns[key]" 
                                    @click="SortTable(SortColumns[key])">
                                    {{key}}
                                </a>
                                <template v-else>
                                    {{key}}
                                </template>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="row in tbody">
                            <td 
                                v-for="index in row.length"
                                :key="index-1"
                                v-if="!Object.values(HiddenColums).includes(index-1)"
                            >
                                {{row[index-1]}}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        ` 
    }
); 