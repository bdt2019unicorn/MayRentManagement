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
                                filterOptions: {enabled: this.SpecialColumns("search").includes(column)}, 
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
                    searchOptions: {enabled: this.SpecialColumns("search").length>0}, 
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
            RouterLinkBind(column, row)
            {
                let hyperlink_object = this.SpecialColumns("hyperlink"); 
                try
                {
                    hyperlink_object = hyperlink_object[column]; 
                    return {
                        to: this.ToActions
                        (
                            {
                                controller: hyperlink_object.controller, 
                                action: hyperlink_object.action,
                                query: 
                                {
                                    id: row[hyperlink_object["object_id"]]
                                }
                            }
                        ) 
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
        template: 
        `
            <vue-good-table v-if="DisplayTable" v-bind="DisplayTable" v-on="$listeners">
                
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