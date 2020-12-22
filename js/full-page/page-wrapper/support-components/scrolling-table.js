Vue.component
(
    "scrolling-table", 
    {
        props: ["table_actions", "table_data"], 
        mixins: [support_mixin],
        components: {...vueGoodTable}, 
        computed: 
        {
            DisplayTable()
            {
                return (this.table_data.length==0)? undefined: 
                {
                    columns: Object.keys(this.table_data[0]).filter(column=>!this.TableActionsColumns("hidden_columns").includes(column)).map
                    (
                        column=>
                        {
                            let sort_actions = this.TableActionsColumns("sort"); 

                            SortFunction = (row1_value, row2_value, col, row1_object, row2_object)=>
                            {
                                let sort_by = sort_actions[column]; 
                                let result = Number(row1_object[sort_by]) - Number(row2_object[sort_by]); 
                                return result==0? 0: (result/Math.abs(result)); 
                            }; 

                            let sort = !Object.keys(sort_actions).includes(column)? {sortable: false}: {sortable: true, sortFn: SortFunction}

                            return {
                                field: column, 
                                label: column, 
                                thClass: 'text-center', 
                                tdClass: "text-right", 
                                filterOptions: {enabled: this.TableActionsColumns("search").includes(column)}, 
                                ...sort 
                            }
                        }                    
                    ), 
                    rows: this.table_data, 
                    styleClass: "vgt-table bordered striped", 
                    searchOptions: {enabled: true}, 
                    maxHeight: "80vh", 
                    fixedHeader: true, 
                    searchOptions: {enabled: this.TableActionsColumns("search").length>0}, 
                    selectOptions: 
                    {
                        enabled: Boolean(this.table_actions.id), 
                        disableSelectInfo: true
                    }
                }
            } 
        },
        methods: 
        {
            // ComponentBind(column, row)
            // {
            //     let filter_out = ["hyperlink_list", "hyperlink", "list"]; 
            //     let is = Object.keys(this.table_actions.special).filter(component=>!filter_out.includes(component)).find 
            //     (
            //         component=>
            //         {
            //             return this.table_actions.special[component][column]; 
            //         }
            //     ); 
            //     let information = R.clone(this.table_actions.special[is]); 
            //     try 
            //     {
            //         Object.keys(information.information).forEach(key=>information[key] = row[information.information[key]]); 
            //     }
            //     catch {}
            //     return {is, ...information}; 
            // }, 
            ComponentBind(props)
            {
                let column = props.column.field; 
                let filter_out = ["list"]; 
                let is = Object.keys(this.table_actions.special).filter(component=>!filter_out.includes(component)).find 
                (
                    component=>
                    {
                        return this.table_actions.special[component][column]; 
                    }
                ); 
                return {is, column, row: props.row, props, special_column: this.SpecialColumns(is)}; 
            }, 
            SpecialColumns(action)
            {
                try 
                {
                    return this.table_actions.special[action] || []; 
                }
                catch 
                {
                    return []; 
                }
            }, 
            TableActionsColumns(action)
            {
                return this.table_actions[action] || []; 
            }
        },
        template: 
        `
            <vue-good-table v-if="DisplayTable" v-bind="DisplayTable" v-on="$listeners">
                
                <template slot="table-actions"><slot name="table-actions"></slot></template>

                <template slot="table-row" slot-scope="props">
                    <component v-if='SpecialColumns("list").includes(props.column.field)' v-bind="ComponentBind(props)"></component>
                    <template v-else>{{props.formattedRow[props.column.field]}}</template>
                </template>

            </vue-good-table>
        ` 
    }
); 