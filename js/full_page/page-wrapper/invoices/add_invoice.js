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
                    name: undefined, 
                    start_date: undefined
                }

            }; 
        },
        components: {FunctionalCalendar}, 
        computed: 
        {
            LabelDateRange()
            {
                return `${moment(this.invoice.start_date).format('DD MMM YYYY')} - ${moment(this.invoice.end_date).format('DD MMM YYYY')}`; 
            }, 
        }, 
        methods: 
        {
            CalendarChooseDay()
            {

            }
        },


        template: 
        `
            <div class="container-fluid">
                <h1>Add New Invoice</h1>
                <br>
                <div class="row">
                    <select-input
                        name="leaseagrm_id"
                        title="Lease Agreement"
                        overview_controller="leaseagrm"
                        select_value="id"
                        text="name"
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