Vue.component
(
    "a-sort-table", 
    {
        props: ["index", "text"], 
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
);

Vue.component
(
    "hyperlink-list-compile", 
    {
        props: ["list"], 
        render(create_element) 
        {
            let template = `<p>${this.list}</p>`; 
            return create_element("p", [create_element(Vue.compile(template))]); 
        },
    }
); 