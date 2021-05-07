Vue.component 
(
    "display-table", 
    {
        props: ["data"], 
        components: {...vueGoodTable}, 
        computed: 
        {
            DisplayTable()    
            {
                return {
                    rows: this.data, 
                    columns: this.data.reduce
                    (
                        (accumulator, current_value)=> [...accumulator, ...Object.keys(current_value).filter(key=>!accumulator.includes(key))], []
                    ).map 
                    (
                        column=>
                        (
                            {
                                field: column, 
                                label: column, 
                                sortable: true, 
                                thClass: 'text-center' 
                            }
                        )
                    ), 
                    paginationOptions: 
                    {
                        enabled: true, 
                        perPage: 10, 
                        perPageDropdown: [10], 
                        dropdownAllowAll: false 
                    }, 
                    styleClass: "vgt-table condensed bordered", 
                    theme: "nocturnal" 
                }
            }
        },
        template: `<vue-good-table v-bind="DisplayTable"></vue-good-table>`
    }
); 