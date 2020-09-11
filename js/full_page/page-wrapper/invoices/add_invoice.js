Vue.component
(
    "add-invoice", 
    {
        mixins:[support_mixin], 
        data() 
        {
            return {
                date_picker_opened: false, 
                function_calendar_model: undefined, 
                invoice: 
                {
                    end_date: undefined, 
                    leaseagrm_id: undefined, 
                    name: "", 
                    start_date: undefined
                }, 
                revenue_type: 
                {
                    rent_and_other_cost: [], 
                    utilities: []
                }, 
                user_input: {}

            }; 
        },
        components: {FunctionalCalendar}, 
        computed: 
        {
            LabelDateRange()
            {
                return this.invoice.start_date?`${moment(this.invoice.start_date).format('DD MMM YYYY')} - ${moment(this.invoice.end_date).format('DD MMM YYYY')}`: ""; 
            }, 
        }, 
        created() 
        {
            this.user_input = this.AjaxRequest("server/user_input_controller/invoice.json"); 
            let revenue_types = this.AjaxRequest(this.OverviewDataUrl("revenue_type")); 
            revenue_types = JSON.parse(revenue_types); 
            this.revenue_type.utilities = revenue_types.filter(revenue_type=>Number(revenue_type.is_utility)); 
            this.revenue_type.rent_and_other_cost = revenue_types.filter(revenue_type=>!this.revenue_type.utilities.includes(revenue_type)); 
        },
        methods: 
        {
            CalendarChooseDay()
            {
                if(this.function_calendar_model.dateRange.end)
                {
                    this.invoice.start_date = this.function_calendar_model.dateRange.start; 
                    this.invoice.end_date = this.function_calendar_model.dateRange.end; 
                    this.function_calendar_model = undefined; 
                    this.date_picker_opened = false; 
                }
            }, 
            LeaseagrmIdSelectChanged()
            {
                this.leaseagrm_id = $(this.$refs["leaseagrm_id_select"]).find("[name='leaseagrm_id']").val(); 

                try
                {
                    let date_data = this.AjaxRequest(`${this.user_input.main_url}LastInvoiceDate&leaseagrm_id=${this.leaseagrm_id}`); 
                    date_data = JSON.parse(date_data); 
                    this.invoice.start_date = Object.values(date_data[0])[0]; 

                    let start_date = new Date(this.invoice.start_date); 
                    let now = new Date(); 
                    let end_month_date = new Date(now.getFullYear(), now.getMonth(), 0); 

                    this.invoice.end_date = (start_date>=now)? this.invoice.start_date: moment(end_month_date).format("YYYY-MM-DD"); 
                }
                catch {}


                if(!this.invoice.name.trim().length>0)
                {
                    let options = $(this.$refs["leaseagrm_id_select"]).find("[name='leaseagrm_id']").children(); 
                    this.invoice.name = `${Object.keys(options).filter(key=>options[key].value==this.leaseagrm_id).map(key=>options[key].innerText)[0]} ${this.LabelDateRange}`; 
                }

            }
        },


        template: 
        `
            <div class="container-fluid">
                <h1>Add New Invoice</h1>
                <br>
                <div class="row" ref="leaseagrm_id_select">
                    <select-input v-bind="user_input.leaseagrm_id" @search-data-changed="LeaseagrmIdSelectChanged"></select-input>
                </div>
                <br>
                <div class="row">
                    <div class="col form-group">
                        <label for="name"><b>Invoice Name</b></label>
                        <input class="form-control" name="name" v-model="invoice.name">
                    </div>
                </div>
                <br>
                <div class="row">
                    <div class="col">
                        <label><b>Period</b></label>
                        <input type="text" class="form-control" @click="date_picker_opened = !date_picker_opened" readonly style="text-align: center;":value="LabelDateRange">
                        <FunctionalCalendar 
                            ref="calendar" 
                            v-if='date_picker_opened' 
                            class="col"
                            dateFormat="yyyy-mm-dd" 
                            :is-date-range='true' 
                            v-model="function_calendar_model" 
                            @choseDay="CalendarChooseDay"
                        ></FunctionalCalendar>
                    </div>
                </div>
                <hr>
                <h3>Invoice Details</h3>
                <br>
                <div class="row">
                    <multi-select-input title="Rent and other cost" :select_atributes="user_input.select_atributes" :select_data="revenue_type.rent_and_other_cost"></multi-select-input>
                    <multi-select-input title="Utilities" :select_atributes="user_input.select_atributes" :select_data="revenue_type.utilities"></multi-select-input>
                </div>

                <br>
                <div class="row">
                    <div class="col">
                        <h6>Rent and other cost</h6>
                    </div>
                </div>
                <br>
                <div class="row">
                    <div class="col">
                        <h6>Utilities</h6>
                    </div>
                </div>
            </div>
        `
    }
); 