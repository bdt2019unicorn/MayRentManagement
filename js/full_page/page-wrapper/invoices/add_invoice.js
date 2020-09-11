Vue.component
(
    "add-invoice", 
    {
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
                }

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

                console.log(this.leaseagrm_id); 

// neeed to do some modification for this function so I can get the whole thing working. 
// more work needed here. We need to add the function so that it can find the date and take the period possible. 


                if(!this.invoice.name.trim().length>0)
                {
                    let test = $(this.$refs["leaseagrm_id_select"]).find("[name='leaseagrm_id']").children(); 
                    console.log(test); 

                    console.log(Object.keys(test).filter(key=>!isNaN(key))); 

                    let options = Object.keys(test).filter(key=>test[key].value==this.leaseagrm_id).map(key=>({value: test[key].value, text: test[key].innerText})); 

                    console.log(options); 


                    let name = Object.keys(test).filter(key=>test[key].value==this.leaseagrm_id).map(key=>test[key].innerText)[0]; 

                    this.invoice.name = name; 


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