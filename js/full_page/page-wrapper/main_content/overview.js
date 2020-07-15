var overview_component = Vue.component 
(
    "overview", 
    {
        mixins:[support_mixin], 
        data()
        {
            return {
                table_data: [], 
                search_data: [], 
                check_array: []
            }; 
        }, 
        computed: 
        {
            PageTitle()
            {
                try 
                {
                    let table_actions = this.TableActions(this.StateObject('controller')); 
                    return table_actions.page_title; 
                }
                catch
                {
                    return this.StateObject("controller"); 
                }
            }    
        },
        created() 
        {
            this.PopulateData(); 
        },
        methods: 
        {
            DeleteData()
            {
                var url = `server/delete_controller/${this.StateObject('controller')}.php`; 
                var result = this.SubmitData("delete", url, this.check_array); 
                if(Number(result))
                {
                    alert("Delete success!"); 
                    this.PopulateData(); 
                }
                else
                {
                    alert("Delete fails, there seems to be a server error"); 
                }
            }, 
            IdCheckChanged(object_id, checked)
            {
                if(checked)
                {
                    this.check_array.push(object_id); 
                }
                else 
                {
                    for(var index=0; index<this.check_array.length; index++)
                    {
                        if(this.check_array[index]==object_id)
                        {
                            this.check_array.splice(index, 1); 
                            index--; 
                        }
                    }
                }
            }, 
            PopulateData()
            {
                this.table_data = this.TableData(this.StateObject('controller')); 
                this.search_data = this.SearchData(); 
                this.check_array = []; 
            }, 
            Search()
            {
                let data = $(this.$refs['search_form']).serializeObject(); 
                let overview_data = this.TableData(this.StateObject('controller')); 
                if(data['search_value'])
                {
                    this.table_data = []; 
                    overview_data.forEach
                    (
                        row => 
                        {
                            if(data['search_category'])
                            {
                                if(row[data['search_category']].toLowerCase().indexOf(data['search_value'].toLowerCase())>=0)
                                {
                                    this.table_data.push(row); 
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
                                    this.table_data.push(row); 
                                }
                            }
                        }
                    );
                    return; 
                }
                this.table_data = overview_data; 
            }, 
            SearchData()
            {
                var search_columns = this.TableActions(this.StateObject('controller')).search; 
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
                
            }, 
            TableActions(controller)
            {
                var table_actions = this.AjaxRequest(`server/overview_controller/table_actions/${controller}.json`);
                return (table_actions)?table_actions:{}; 
            }
        },
        watch: 
        {
            BuildingId: function(new_value, old_value)
            {
                this.PopulateData(); 
            }, 
            StateController: function(new_value, old_value)
            {
                this.PopulateData(); 
            }
        },
        template: 
        `
            <div class="container-fluid">
                <h1>{{PageTitle}}</h1>
                <div class="row">
                    <form class="container-fluid row col" v-if="search_data && (TableData(StateObject('controller')).length>0)" ref="search_form" @submit.prevent="Search">
                        <text-input name='search_value'></text-input>
                        <select-input name='search_category' v-if="search_data.length>0" :select_data="search_data" select_value="value" text="text" not_required="false"></select-input>
                        <div class="col--2">
                            <button class="btn btn-primary" type="submit">Search</button>
                        </div>
                    </form>

                    <div class="col-5 row" v-if="StateObject('controller')!='overview'">

                        <div class="col text-right">
                            <button :disabled="check_array.length==0" class="btn btn-danger" type="button" @click="DeleteData">Delete</button>
                        </div>
                        <div class="col text-center">
                            <button class="btn btn-secondary" v-if="check_array.length!=1" disabled>Edit</button>
                            <a-hyperlink class="btn btn-secondary" v-else :controller="StateObject('controller')" text="Edit" :object_id="check_array[0]"></a-hyperlink>
                        </div>
                        <div class="col text-left">
                            <a class="btn btn-success" href='javascript:window.store_track.commit("RedirectUrl",{param: "action", value: "add"});'>Add</a>
                        </div>

                    </div>
                </div>
                <br>
                <scrolling-table class="row" :table_data="table_data" :table_actions="TableActions(StateObject('controller'))" @id-check-changed="IdCheckChanged"></scrolling-table>
            </div>
        `
    }
); 
