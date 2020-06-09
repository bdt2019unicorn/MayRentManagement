var display_table = new Vue
(
    {
        el: "#display_table", 
        data: 
        {
            table_data: [], 
            thead: {}, 
            tbody: []
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
        }
    }
); 