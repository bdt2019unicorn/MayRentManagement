var overview_component = Vue.component 
(
    "Overview", 
    {
        mixins:[support_mixin], 
        data()
        {
            return {
                table_data: []
            }; 
        }, 
        created() 
        {
            this.table_data = this.OverviewData; 
        },
        computed: 
        {
            OverviewData()
            {
                return this.TableData(this.StateController); 
            }, 
            SearchData()
            {
                var search_columns = this.TableActions(this.StateController).search; 
                if(search_columns)
                {
                    var search_data = []; 
                    search_columns.forEach
                    (
                        element => 
                        {
                            search_data.push
                            (
                                {
                                    value: element, 
                                    text: element
                                }
                            ); 
                        }
                    );
                    return search_data; 
                }
                
            }
        },
        methods: 
        {
            TableActions(controller)
            {
                var table_actions = AjaxRequest(`server/overview_controller/table_actions/${controller}.json`);
                return (table_actions)?table_actions:{}; 
            }, 
            Search()
            {
                let data = $(this.$refs['search_form']).serializeObject(); 
                if(data['search_value'])
                {
                    let overview_data = []; 
                    this.OverviewData.forEach
                    (
                        row => 
                        {
                            if(data['search_category'])
                            {
                                if(row[data['search_category']].toLowerCase().indexOf(data['search_value'].toLowerCase())>=0)
                                {
                                    overview_data.push(row); 
                                }
                            }
                            else
                            {
                                function CheckRow()
                                {
                                    for(var value of Object.values(row))
                                    {
                                        try 
                                        {
                                            if(value.toLowerCase().indexOf(data['search_value'].toLowerCase())>=0)
                                            {
                                                return true; 
                                            }
                                        }
                                        catch{}
                                    }
                                    return false; 
                                }
                                if(CheckRow())
                                {
                                    overview_data.push(row); 
                                }
                            }
                        }
                    );
                    this.table_data = overview_data; 
                    return; 
                }
                this.table_data = this.OverviewData; 
            }
        },
        watch: 
        {
            OverviewData: function()
            {
                this.table_data = this.OverviewData; 
            }
        },
        template: 
        `
            <div>
                <h1>{{CapitalizeFirstWord(StateController)}}</h1>

                <form 
                    class="container-fluid row"
                    v-if="SearchData"
                    ref="search_form"
                    @submit.prevent="Search"
                >
                    <text-input name='search_value'></text-input>
                    <select-input 
                        name='search_category' 
                        :select_data="SearchData" 
                        value="value"
                        text="text"
                        not_required="false"
                    ></select-input>
                    <div class="col">
                        <button class="btn btn-primary" type="submit">Search</button>
                    </div>
                </form>

                <scrolling-table
                    :table_data="table_data"
                    :table_actions="TableActions(StateController)"
                ></scrolling-table>
            </div>
        `
    }
); 
