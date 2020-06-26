var scrolling_table = Vue.component
(
    "scrolling-table", 
    {
        props: ["extra_class", "tb_style", "table_data"], 
        data() 
        {
            return {
                thead: {}, 
                tbody: []
            };
        }, 
        mounted() 
        {
            this.UpdateData(); 
        },

        methods: 
        {
            UpdateData()
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

                var thead = THead(this.table_data); 
                var tbody = TBody(thead, this.table_data); 
                this.thead = thead; 
                this.tbody = tbody; 
            }
        },

        watch: 
        {
            table_data: function()
            {
                this.UpdateData(); 
            }
        }, 

        template: 
        `
            <div 
                :class="['scrolling-div', this.extra_class]"
                :style="tb_style"
            >
                <table style="width: 100%;">
                    <thead>
                        <tr>
                            <th v-for="key in Object.keys(thead)">{{key}}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="row in tbody">
                            <td v-for="data in row">{{data}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        ` 
    }
); 