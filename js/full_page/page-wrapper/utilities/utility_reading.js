Vue.component
(
    "utility-reading", 
    {
        mixins: [utilities_mixin], 
        data() 
        {
            return {
                test_model: "Test Edit", 
                apartment_id: "", 
                utilities_readings: []
            }
        },
        computed: 
        {
            UtilitiesReadingDisplay()
            {
                return this.utilities_readings.map 
                (
                    ({revenue_type_id, apartment_id, ...rest}) => rest 
                ); 
            }    
        },
        methods: 
        {
            TestInput(event)
            {
                console.log("input test"); 
                this.test_model = event.target.innerText; 
            }, 
            ApartmentIdValueChanged()
            {
                this.apartment_id = $(this.$refs["apartments_select"]).find("[name='apartment_id']").val();
                try 
                {
                    var current_readings = this.AjaxRequest(`${this.main_url}CurrentReadings&apartment_id=${this.apartment_id}`); 
                    current_readings = JSON.parse(current_readings); 

                    CurrentReading = function(revenue_type_id)
                    {
                        try 
                        {
                            return current_readings.filter(reading=>reading.revenue_type_id==revenue_type_id)[0].number; 
                        }
                        catch
                        {
                            return 0; 
                        }
                    }

                    this.utilities_readings = this.select_data.utilities.map
                    (
                        revenue_type=>
                        (
                            {
                                revenue_type_id: revenue_type.id, 
                                apartment_id: this.apartment_id, 
                                service: revenue_type.name, 
                                apartment_name: this.select_data.apartments.filter(apartment=>apartment.id==this.apartment_id)[0].name, 
                                date: moment().format("DD MMM YYYY"), 
                                time: moment().format("HH:mm"), 
                                number: "", 
                                current_reading: CurrentReading(revenue_type.id) 
                            }
                        )
                    ); 
                } 
                catch
                {
                    this.utilities_readings = []; 
                }

            }
        },
        watch: 
        {
            test_model: function(new_value, old_value)
            {
                console.log(new_value, old_value); 
            }    
        },
        template:
        `
            <div class="container-fluid">
                <h1>Utilities</h1>
                <h6>Add new utility reading</h6>
                <div class="row" ref="apartments_select">
                    <select-input :select_data="select_data.apartments" v-bind="select_data" name="apartment_id" not_required="true" @search-data-changed="ApartmentIdValueChanged">All Apartment</select-input>
                </div>
                <div class="container-fluid" v-if="apartment_id">
                    <table class="table table-striped table-bordered table-hover">
                        <thead class="thead-light">
                            <tr class="text-center">
                                <th>Service</th>
                                <th>Apartment Name</th>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Reading</th>
                                <th>Previous Reading</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    you cann't edit me 
                                </td>
                                <td contenteditable>
                                    you should be able to edit me 
                                </td>
                            </tr>
                            <tr contenteditable>
                                <td>Edit me</td>
                                <td>Edit me</td>
                                <td>Edit me</td>
                                <td>Edit me</td>
                            </tr>
                            <tr contenteditable>
                                <td @input="TestInput">{{test_model}}</td>
                                <td @input="TestInput">{{test_model}}</td>
                                <td @input="TestInput">{{test_model}}</td>
                                <td @input="TestInput">{{test_model}}</td>
                            </tr>
                            <tr>
                                <td>
                                    <p contenteditable @input="TestInput">Change me </p>
                                </td>
                            </tr>



                            <tr v-for="(reading, index) in UtilitiesReadingDisplay">
                                <td v-for="property in Object.keys(reading)"><p contenteditable @input="TestInput">{{property}}</p><td>
                                <td>{{index}} - {{reading}}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `
    }    
); 


// need to see why I have an extra field in my table. 