Vue.component
(
    "unable-to-delete", 
    {
        props: ["unable_to_delete"], 
        computed: 
        {
            UnableToDelete()
            {
                return this.unable_to_delete? Object.keys(this.unable_to_delete).reduce
                (
                    (accumulator, current_value)=>
                    {
                        var table_name = this.unable_to_delete[current_value][0]["table_name"]; 
                        return {
                            ...accumulator, 
                            [table_name]: this.unable_to_delete[current_value].map(({table_name, ...rest})=>rest) 
                        }
                    }, {}
                ): undefined; 
            }
        }, 
        template: 
        `
            <div>
                <div class="row">
                    <h2 class="col-11 text-danger">Unable to delete the unit - please check these places</h2>
                    <div class="col-1"><submit-button icon="times" title="Back to list" v-on="$listeners"></submit-button></div>
                </div>
                <template v-for="table in Object.keys(UnableToDelete)">
                    <h3 class="text-center">{{table}}</h3>
                    <display-table :data="UnableToDelete[table]"></display-table>
                </template>
            </div>
        `
    }
); 