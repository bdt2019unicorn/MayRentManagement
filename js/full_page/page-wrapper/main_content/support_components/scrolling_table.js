var th_sort_table = Vue.component
(
    "a-sort-table", 
    {
        props: ["text", "index"], 
        data()
        {
            return {
                current_operation: "<", 
                operation_switch: 
                {
                    ">": "<", 
                    "<": ">"
                }
            }
        }, 
        methods: 
        {
            SortTable()
            {
                let script = 
                `
                    while (Number(items[i][key]) ${this.current_operation} pivot) 
                    {
                        i++;
                    }
                    while (Number(items[j][key]) ${this.operation_switch[this.current_operation]} pivot) 
                    {
                        j--;
                    }
                `; 
                this.$emit("sort-table", this.index, script); 
                this.current_operation = this.operation_switch[this.current_operation]; 
            }    
        },
        template: 
        `
            <a 
                href="javascript:void(0);" 
                class="text-white" 
                @click="SortTable"
            >
                {{text}}
            </a>
        `
    }
)



var scrolling_table = Vue.component
(
    "scrolling-table", 
    {
        props: ["tb_style", "table_data", "table_actions"], 
        mixins: [support_mixin], 
        data() 
        {
            return {
                thead: {}, 
                tbody: []
            };
        }, 
        created() 
        {
            this.SetupTable();   
        }, 

        methods: 
        {
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
                                v-if='!SpecialColumnsIndexes("hidden_columns")[key]'
                                class="sticky-top"
                            >
                                <a-sort-table
                                    v-if='SpecialColumnsIndexes("sort")[key]' 
                                    :text="key"
                                    :index='SpecialColumnsIndexes("sort")[key]'
                                    @sort-table="SortTable"
                                >
                                </a-sort-table>
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
                                v-if='!Object.values(SpecialColumnsIndexes("hidden_columns")).includes(index-1)'
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