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
                main_url: "server/invoice_controller/action.php?command="

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
                    let date_data = this.AjaxRequest(`${this.main_url}LastInvoiceDate&leaseagrm_id=${this.leaseagrm_id}`); 
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
                    <select-input
                        name="leaseagrm_id"
                        title="Lease Agreement"
                        overview_controller="leaseagrm"
                        select_value="id"
                        text="name"
                        @search-data-changed="LeaseagrmIdSelectChanged"
                    ></select-input>
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

                
            </div>
        `
    }
); 