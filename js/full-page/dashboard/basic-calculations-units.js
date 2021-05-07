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
                return `server/controller/database/${command}.php?table=${this.OverviewController}&id=${id}`; 
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
                <b-dropdown :text="current_table || 'All Basic Units'" block lazy menu-class="w-100" variant="success">
                    <b-dropdown-item @click="current_table=undefined"><br></b-dropdown-item>
                    <b-dropdown-item v-for="table in Object.keys(tables)" @click="current_table=table">{{table}}</b-dropdown-item>
                </b-dropdown>
                <br>
                <unable-to-delete v-if="unable_to_delete" :unable_to_delete="unable_to_delete" @submit-button-clicked="unable_to_delete=undefined"></unable-to-delete>

                <div v-if="current_table" v-show="!unable_to_delete">
                    <basic-calculations-form 
                        :edit_id="edit_id"
                        @click="GeneralEditButtonClick(undefined, undefined)"
                        @submit="SubmitForm"
                        v-model="edit_text"
                    >
                        <div v-if="special_tables.includes(current_table)" class="row">
                            <checkbox-input 
                                v-if="extra_edit && current_table=='Revenue Type'" 
                                name="is_utility" 
                                :edit_data="edit_data" 
                                title="Utility"
                            ></checkbox-input>
                            <leaseagrm-period-calculation
                                v-else-if="extra_edit && current_table=='Lease Agreement Period'"
                                :basic_calculations="basic_calculations"
                                :edit_data="edit_data"
                                :edit_text="edit_text"
                            ></leaseagrm-period-calculation>
                        </div>
                    </basic-calculations-form>
                    <basic-calculations-list 
                        :basic_calculations="basic_calculations" 
                        @general-edit-button="GeneralEditButtonClick" 
                        @delete-basic-unit="DeleteBasicUnit"
                    ></basic-calculations-list>
                </div>
                <div v-else style="height: 75vh;"></div>
            </div>
        `
    }
); 