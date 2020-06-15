var scrolling_table = Vue.component
(
    "scrolling-table", 
    {
        props: ["extra_class"], 
        data() 
        {
            return {
                table_data: [], 
                thead: {}, 
                tbody: []
            };
        }, 

        mounted() 
        {
            if(window.store_track.state.action!="Overview")
            {
                return; 
            }

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
            }
        }, 

        template: 
        `
            <div :class="['scrolling-div', this.extra_class]">
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