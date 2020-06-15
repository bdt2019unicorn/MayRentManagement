var scrolling_table = Vue.component
(
    "scrolling-table", 
    {
        props: ["extra_class", "tb_style", "excel_data"], 
        data() 
        {
            return {
                table_data: [], 
                thead: {}, 
                tbody: []
            };
        }, 

        methods: 
        {
            OverviewData()
            {
                var url = "server/overview_controller/"+window.store_track.state.controller+".php"; 
                var data = AjaxRequest(url);
    
                try 
                {
                    this.table_data = JSON.parse(data); 
                }
                catch(exception)
                {
                    return; 
                }          
            }, 
            LoadExcelData()
            {
                if(this.excel_data!=null)
                {
                    this.table_data = this.excel_data; 
                }
                else
                {
                    this.table_data = []; 
                }
            }
        },

        mounted() 
        {
            this.LoadExcelData(); 
            if(window.store_track.state.action=="Overview")
            {
                this.OverviewData(); 
            }
        },

        watch: 
        {
            table_data: function()
            {
                if(this.table_data!=[])
                {
                    let thead = {}; 
                    let index = 0; 
                    this.table_data.forEach
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
                    this.thead = thead; 
                }
            }, 
            thead: function()
            {
                this.tbody = []; 
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
            }, 
            excel_data: function()
            {
                this.LoadExcelData(); 
            }
        }, 

        template: 
        `
            <div 
                :class="['scrolling-div', this.extra_class]"
                :style="tb_style"
            >
                <table v-if="table_data!=[]" style="width: 100%;">
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