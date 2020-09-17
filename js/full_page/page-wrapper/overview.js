Vue.component 
(
    "overview", 
    {
        mixins:[support_mixin], 
        data()
        {
            return {
                table_actions: {}, 
                table_data: [], 
                check_array: []
            }; 
        }, 
        created() 
        {
            this.PopulateData(); 
        },
        methods: 
        {
            DeleteData()
            {
                var url = `server/database_controller/delete.php?table=${this.CurrentController}`; 
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
                    this.check_array = this.check_array.filter(value=>value!=object_id); 
                }
            }, 
            PopulateData()
            {
                this.table_data = this.TableData(this.CurrentController); 
                this.table_actions = this.TableActions(this.CurrentController); 
                this.check_array = []; 
            }, 
            Search()
            {
                let data = $(this.$refs['search_form']).serializeObject(); 
                let overview_data = this.TableData(this.CurrentController); 
                if(data['search_value'])
                {
                    this.table_data = overview_data.filter 
                    (
                        row=>
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

                            function CheckCategory()
                            {
                                try 
                                {
                                    return (row[data['search_category']].toLowerCase().indexOf(data['search_value'].toLowerCase())>=0); 
                                }
                                catch 
                                {
                                    return false; 
                                }
                            }
                            return (data['search_category'])? CheckCategory() : CheckRow(); 
                        }
                    ); 
                    return; 
                }
                this.table_data = overview_data; 
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
                <h1>{{table_actions.page_title || "Overview"}}</h1>
                <div class="row">
                    <form class="container-fluid row col" v-if="table_actions.search" ref="search_form" @submit.prevent="Search">
                        <text-input name='search_value'></text-input>
                        <select-input 
                            name='search_category' 
                            v-if="table_actions.search.length>0" 
                            :select_data="table_actions.search?table_actions.search.map(element=>({value: element, text: element})): undefined" 
                            select_value="value" 
                            text="text" 
                            not_required="true"
                        ></select-input>
                        <div class="col--2"> 
                            <button class="btn btn-primary" type="submit">Search</button>
                        </div>
                    </form>

                    <div class="col-4 row" v-if="CurrentController!='overview'">

                        <div class="col text-right">
                            <button :disabled="check_array.length==0" class="btn btn-danger" type="button" @click="DeleteData">Delete</button>
                        </div>
                        <div class="col text-center">
                            <button class="btn btn-secondary" v-if="check_array.length!=1" disabled>Edit</button>
                            <router-link 
                                class="btn btn-secondary" 
                                v-else 
                                :to="ToActions({action: table_actions.edit_action || 'edit', query: {id: check_array[0]}})"
                            >
                                Edit
                            </router-link>
                        </div>

                    </div>
                </div>
                <br>
                <scrolling-table class="row" v-bind="$data" @id-check-changed="IdCheckChanged"></scrolling-table>
            </div>
        `
    }
); 