Vue.component 
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
                    let table_actions = this.TableActions(this.CurrentController); 
                    return table_actions.page_title; 
                }
                catch
                {
                    return "Overview"; 
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
                var url = `server/delete_controller.php?table=${this.CurrentController}`; 
                var result = this.SubmitData("delete", url, this.check_array); 
                if(Number(result))
                {
                    alert("Delete success!"); 
                    window.location.reload(); 
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
                this.table_data = this.TableData(this.CurrentController); 
                this.search_data = this.SearchData(); 
                this.check_array = []; 
            }, 
            Search()
            {
                let data = $(this.$refs['search_form']).serializeObject(); 
                let overview_data = this.TableData(this.CurrentController); 
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
                var search_columns = this.TableActions(this.CurrentController).search; 
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
        watch: 
        {
            $route(to, from)
            {
                this.PopulateData(); 
            }
        },
        template: 
        `
            <div class="container-fluid">
                <h1>{{PageTitle}}</h1>
                <div class="row">
                    <form class="container-fluid row col" v-if="search_data" ref="search_form" @submit.prevent="Search">
                        <text-input name='search_value'></text-input>
                        <select-input name='search_category' v-if="search_data.length>0" :select_data="search_data" select_value="value" text="text" not_required="true"></select-input>
                        <div class="col--2">
                            <button class="btn btn-primary" type="submit">Search</button>
                        </div>
                    </form>

                    <div class="col-5 row" v-if="CurrentController!='overview'">

                        <div class="col text-right">
                            <button :disabled="check_array.length==0" class="btn btn-danger" type="button" @click="DeleteData">Delete</button>
                        </div>
                        <div class="col text-center">
                            <button class="btn btn-secondary" v-if="check_array.length!=1" disabled>Edit</button>
                            <router-link class="btn btn-secondary" v-else :to="'edit?id=' + check_array[0]" append>Edit</router-link>
                        </div>
                        <div class="col text-left">
                            <router-link class="btn btn-success" to="add" append>Add</router-link>
                        </div>

                    </div>
                </div>
                <br>
                <scrolling-table class="row" :table_data="table_data" :table_actions="TableActions(CurrentController)" @id-check-changed="IdCheckChanged"></scrolling-table>
            </div>
        `
    }
); 
