Vue.component
(
    "basic-calculations-units", 
    {
        mixins: [support_mixin], 
        data: () =>
        (
            {
                basic_calculations: [], 
                current_table: undefined, 
                edit_id: undefined, 
                edit_text: undefined, 
                edit_data: undefined, 
                extra_edit: true, 
                special_tables: ['Revenue Type', 'Lease Agreement Period'], 
                tables: 
                {
                    "Document Types": "document_type", 
                    "Expense Type": "expense_type", 
                    "Lease Agreement Period": "leaseagrm_period", 
                    "Revenue Type": "revenue_type"
                }, 
                unable_to_delete: undefined
            }
        ),
        components: {...bootstrap}, 
        computed: 
        {
            OverviewController()
            {
                return this.tables[this.current_table]; 
            }, 
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
        methods: 
        {
            BasicCalculations()
            {
                this.basic_calculations = this.OverviewController?this.TableData(this.OverviewController): [];
                this.GeneralEditButtonClick(undefined, undefined);  
            }, 
            DeleteBasicUnit(id)
            {
                let url = this.ServerUrl("check_delete", id); 
                let result = this.AjaxRequest(url); 
                try 
                {
                    this.unable_to_delete = JSON.parse(result); 
                } 
                catch
                {
                    url = this.ServerUrl("delete"); 
                    result = this.SubmitData("delete", url, [id]); 
                    this.HandleResult(result); 
                }
            }, 
            ExtraEditReset()
            {
                this.ResetValue({value_name: "extra_edit", new_value: true}); 
            }, 
            GeneralEditButtonClick(id, name)
            {
                this.edit_id = id; 
                this.edit_text = name; 
                this.edit_data = this.basic_calculations.find(element=> (element.id ==id) && (element.name==name)); 
            }, 
            HandleResult(result)
            {
                if(Number(result))
                {
                    this.BasicCalculations(); 
                    this.ExtraEditReset(); 
                }
                else
                {
                    alert("Something is wrong with the server! Please try again"); 
                }
            }, 
            ServerUrl(command, id=undefined)
            {
                return `server/database_controller/${command}.php?table=${this.OverviewController}&id=${id}`; 
            }, 
            SubmitForm(event)
            {
                event.preventDefault(); 
                var data = this.special_tables.includes(this.current_table)? Object.fromEntries(new FormData(event.currentTarget)): {name: this.edit_text}; 
                var url = this.ServerUrl(this.edit_id?"edit": "import", this.edit_id); 
                var result = this.SubmitData(this.edit_id?"edit":"excel", url, this.edit_id?data:[data]); 
                this.HandleResult(result); 
            }
        },
        watch: 
        {
            current_table: function(new_value, old_value) 
            {
                this.BasicCalculations(); 
            }, 
            edit_data: function(new_value, old_value)
            {
                this.ExtraEditReset(); 
            }
        }, 
        template: 
        `
            <div>
                <b-dropdown 
                    :text="current_table || 'All Basic Units'" 
                    block 
                    lazy
                    menu-class="w-100" 
                    variant="success"
                >
                    <b-dropdown-item @click="current_table=undefined"><br></b-dropdown-item>
                    <b-dropdown-item v-for="table in Object.keys(tables)" @click="current_table=table">
                        {{table}}
                    </b-dropdown-item>
                </b-dropdown>
                <br>

                <div v-if="unable_to_delete">
                    <div class="row">
                        <h2 class="col-11 text-danger">Unable to delete the unit - please check these places</h2>
                        <div class="col-1">
                            <submit-button 
                                icon="times" 
                                title="Back to list" 
                                @submit-button-clicked="unable_to_delete=undefined"
                            ><submit-button>
                        </div>
                    </div>
                    <template v-for="table in Object.keys(UnableToDelete)">
                        <h3 class="text-center">{{table}}</h3>
                        <display-table :data="UnableToDelete[table]"></display-table>
                    </template>
                </div>

                <div v-if="current_table" class="basic-calculations-unit-div" v-show="!unable_to_delete">
                    <div class="row">
                        <form class="col-12 p-1" @submit="SubmitForm">
                            <div :class="special_tables.includes(current_table)?'mb-2 mt-2': undefined">
                                <input name="name" ref="name_input" class="basic-calculations-unit-add-input" type="text" v-model="edit_text">
                                <span class="basic-calculations-unit-span">
                                    <button type="submit" class="btn btn-success ml-1 mr-1 p-1 rounded-circle">
                                        <i :class="(edit_id?'fas fa-check-double': 'fa fa-plus')"></i>
                                    </button>
                                    <button type="button" class="btn btn-danger ml-1 mr-1 p-1 rounded-circle" @click="GeneralEditButtonClick(undefined, undefined)">
                                        <i class="fa fa-times"></i>
                                    </button>
                                </span>
                            </div>
                            <div v-if="current_table=='Revenue Type'" class="col-12 row">
                                <checkbox-input 
                                    v-if="extra_edit"
                                    name="is_utility" 
                                    :edit_data="edit_data"
                                    title="Is Utility"
                                ></checkbox-input>
                            </div>
                        </form>
                    </div>
                    <div>
                        <ul class="list-unstyled pt-4">
                            <li class="basic-calculations-unit-li" v-for="{id, name} in basic_calculations">
                                <span>{{name}}</span>
                                <div class="buttons">
                                    <button class="edit" title="Edit" @click="GeneralEditButtonClick(id, name)">
                                        <i class="far fa-edit"></i>
                                    </button>
                                    <button class="remove" title="Remove" @click="DeleteBasicUnit(id)">
                                        <i class="fa fa-trash-alt"></i>
                                    </button>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div v-else style="height: 75vh;"></div>
            </div>
        `
    }
); 