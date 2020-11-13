Vue.component
(
    "problem-leaseagrms", 
    {
        props: ["leaseagrm"], 
        mixins: [table_actions_mixin], 
        data() 
        {
            return {
                leaseagrm_edit: undefined, 
                leaseagrm_table: "Contracts with no tenants and unit", 
            }
        },
        components: {...vueGoodTable, ...vueFragment}, 
        computed: 
        {
            LeaseagrmCategorized()
            {
                let partition_all_null = R.partition(leaseagrm=>(leaseagrm["Unit"]==undefined && leaseagrm["Tenant Name"]==undefined), this.leaseagrm); 
                let unit_tenant_partition = R.partition(leaseagrm=>leaseagrm["Unit"]==undefined, partition_all_null[1]); 
                return {
                    "Contracts with no tenants and unit": partition_all_null[0], 
                    "Contract with no unit": unit_tenant_partition[0], 
                    "Contract with no head tenant": unit_tenant_partition[1]
                }; 
            }, 
            LeaseagrmCurrentTable()
            {
                let rows= this.LeaseagrmCategorized[this.leaseagrm_table]; 
                return (rows.length==0)? undefined: 
                {
                    rows: rows, 
                    columns: Object.keys(rows[0]).map
                    (
                        column=>
                        (
                            {
                                field: column, 
                                label: column, 
                                type: column=="ID"?"number": column.includes("Date")? "date": undefined, 
                                sortable: true, 
                                filterOptions: {enabled: true},
                                thClass: 'text-center'
                            }
                        )
                    ).map
                    (
                        ({type, ...rest})=>
                        (
                            type=="date"? 
                            {
                                type: type, 
                                ...rest, 
                                dateInputFormat: 'dd/MM/yyyy', 
                                dateOutputFormat: 'dd/MM/yyyy'
                            }: {type, ...rest}
                        )
                    ), 
                    styleClass: "vgt-table striped", 
                    searchOptions: {enabled: true}, 
                    selectOptions: 
                    {
                        enabled: true, 
                        disableSelectInfo: true
                    }
                }; 
            }, 
            TableEditDeleteBind()
            {
                let to = undefined; 
                if(this.check_array.length==1)
                {
                    to = 
                    {
                        name: "general-edit", 
                        params: 
                        {
                            controller: "leaseagrm"
                        }, 
                        query: 
                        {
                            id: this.check_array[0]
                        }
                    }
                }
                return {
                    slot: "table-actions", 
                    action: "edit", 
                    check_array: this.check_array, 
                    controller: "leaseagrm", 
                    to: to 
                }
            }
        },
        methods: 
        {
            DeleteSuccess()
            {
                all_leaseagrm = this.leaseagrm.filter(leaseagrm=>!this.check_array.includes(leaseagrm.ID)); 
                this.check_array = []; 
                this.$emit("problem-leaseagrm-deleted", all_leaseagrm); 
            }    
        },
        template: 
        `
            <fragment>
                <vs-select :success="true" class="my-3 w-100" style="text-align-last: center;" v-model="leaseagrm_table">
                    <vs-select-item v-for="key in Object.keys(LeaseagrmCategorized).map(title=>({text: title, value: title}))" v-bind="key" />
                </vs-select>
                <vue-good-table class="my-3" v-if="LeaseagrmCurrentTable" v-bind="LeaseagrmCurrentTable" @on-selected-rows-change="IdCheckChanged(arguments[0].selectedRows, 'ID')">
                    <table-actions v-bind="TableEditDeleteBind" @delete-success="DeleteSuccess"></table-actions>
                </vue-good-table>
            </fragment>
        `
    }
); 