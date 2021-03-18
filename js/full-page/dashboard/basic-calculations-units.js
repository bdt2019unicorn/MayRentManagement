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
        methods: 
        {
            BasicCalculations()
            {
                var overview_controller = this.tables[this.current_table]; 
                this.basic_calculations = overview_controller?this.TableData(overview_controller): []; 
                this.edit_text = undefined; 
                this.edit_id = undefined; 
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
                    <div class="position-relative">
                        <input class="basic-calculations-unit-add-input" type="text" v-model="edit_text">
                        <button class="basic-calculations-unit-add-button" @click="GeneralButtonClick">
                            <i :class="'basic-calculations-unit-add-i ' + (edit_id?'fas fa-check-double': 'fa fa-plus')"></i>
                        </button>
                    </div>
                    <div>
                        <ul class="list-unstyled pt-4">
                            <li class="basic-calculations-unit-li" v-for="{id, name} in basic_calculations">
                                <span>{{name}}</span>
                                <div class="buttons">
                                    <button class="edit" title="Edit" @click="GeneralEditButtonClick(id, name)">
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
                <div v-else style="height: 75vh;"></div>
            </fragment>
        `
    }
); 