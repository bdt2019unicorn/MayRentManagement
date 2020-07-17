Vue.component
(
    "UtilitiesOverview", 
    {
        props: [], 
        mixins: [support_mixin], 
        data()
        {
            return {
                apartment_id: "", 
                select_data: 
                [
                    {
                        id: 1, 
                        value: "electric"
                    }, 
                    {
                        id: 2, 
                        value: "water"
                    }
                ], 
                table_data: 
                [
                    {
                        id: 1, 
                        name: "test"
                    }, 
                    {
                        id: 2, 
                        name: "test"
                    }
                ], 
                utility_id: ""
            }
        }, 
        template:
        `
            <div class="container-fluid">
                <h1>Utilities</h1>

                <div class="row">
                    <form class="container-fluid col">  
                        <div class="row">
                            <select-input :select_data="select_data" select_value="id" text="value" option_title="All Utilities" not_required="true"></select-input>
                            <select-input :select_data="select_data" select_value="id" text="value" option_title="All Utilities" not_required="true"></select-input>
                            <div class="col-2">
                                <button class="btn btn-primary">Search</button>
                            </div>
                        </div>
                    </form>
                </div>

                <scrolling-table :table_data="table_data"></scrolling-table>

            </div>
        `
    }
); 