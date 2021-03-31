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
                tables: 
                {
                    "Document Types": "document_type", 
                    "Expense Type": "expense_type", 
                    "Lease Agreement Period": "leaseagrm_period", 
                    "Revenue Type": "revenue_type"
                } 
            }
        ),
        components: {...bootstrap, ...vueFragment}, 
        computed: 
        {
            OverviewController()
            {
                return this.tables[this.current_table]; 
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
                console.log(result); 
            }, 
            GeneralButtonClick()
            {
                if(this.edit_id)
                {
                    console.log("edit things"); 
                }
                else 
                {
                    console.log("adding things"); 
                }
                this.GeneralEditButtonClick(undefined, undefined); 
            }, 
            GeneralEditButtonClick(id, name)
            {
                this.edit_id = id; 
                this.edit_text = name; 
            }, 
            ServerUrl(command, id)
            {
                return `server/database_controller/${command}.php?table=${this.OverviewController}&id=${id}`; 
            }, 
            SubmitForm(event, special_table)
            {
                event.preventDefault(); 
                var data = special_table? Object.fromEntries(new FormData(event.currentTarget)): {name: this.edit_text}; 
                var url = this.ServerUrl(this.edit_id?"edit": "import", this.edit_id); 
                var result = this.SubmitData(this.edit_id?"edit":"excel", url, this.edit_id?data:[data]); 
                if(Number(result))
                {
                    this.BasicCalculations(); 
                }
                else
                {
                    alert("Something is wrong with the server! Please try again"); 
                }
            }
        },
        watch: 
        {
            current_table: function(new_value, old_value) 
            {
                this.BasicCalculations(); 
            }
        }, 
        template: 
        `
            <fragment>
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
                
                <div v-if="current_table=='Lease Agreement Period'" class="basic-calculations-unit-div">
                    <div class="position-relative">
                        <input class="basic-calculations-unit-add-input" type="text">
                        <button class="basic-calculations-unit-add-button" value="update">
                            <i class="basic-calculations-unit-add-i fas fa-check-double"></i>
                            <!--<i class="fas fa-check-double"></i>-->
                        </button>
                    </div>
                    <div>
                        <ul class="list-unstyled pt-4">
                            <li class="basic-calculations-unit-li" v-for="unit in basic_calculations">
                                <span>{{unit}}</span>
                                <div class="buttons">
                                    <button class="edit" title="Edit">
                                        <i class="far fa-edit"></i>
                                    </button>
                                    <button class="remove" title="Remove">
                                        <i class="fa fa-trash-alt"></i>
                                    </button>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                <div v-if="current_table=='Revenue Type'" class="basic-calculations-unit-div">
                    <div class="position-relative">
                        <input class="basic-calculations-unit-add-input" type="text">
                        <button class="basic-calculations-unit-add-button" value="update">
                            <i class="basic-calculations-unit-add-i fas fa-check-double"></i>
                            <!--<i class="fas fa-check-double"></i>-->
                        </button>
                    </div>
                    <div>
                        <ul class="list-unstyled pt-4">
                            <li class="basic-calculations-unit-li" v-for="unit in basic_calculations">
                                <span>{{unit}}</span>
                                <div class="buttons">
                                    <button class="edit" title="Edit">
                                        <i class="far fa-edit"></i>
                                    </button>
                                    <button class="remove" title="Remove">
                                        <i class="fa fa-trash-alt"></i>
                                    </button>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                <div v-if="current_table" class="basic-calculations-unit-div">
                    <div class="row">
                        <form class="col p-1" @submit="SubmitForm">
                            <input name="name" ref="name_input" class="basic-calculations-unit-add-input" type="text" v-model="edit_text">
                            <span class="basic-calculations-unit-span">
                                <button type="submit" class="btn btn-success ml-1 mr-1 p-1 rounded-circle">
                                    <i :class="(edit_id?'fas fa-check-double': 'fa fa-plus')"></i>
                                </button>
                                <button type="button" class="btn btn-danger ml-1 mr-1 p-1 rounded-circle" @click="GeneralEditButtonClick(undefined, undefined)">
                                    <i class="fa fa-times"></i>
                                </button>
                            </span>
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
            </fragment>
        `
    }
); 