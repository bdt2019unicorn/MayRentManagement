Vue.component
(
    "utility-reading", 
    {
        mixins: [utilities_mixin], 
        data() 
        {
            return {
                apartment_id: "", 
                contenteditable: ["date", "time", "number"], 
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
            }, 
            
            
            UtilitiesReadingValid()
            {
                let valid = this.utilities_readings.filter
                (
                    ({date, time, number, current_reading, ...rest })=>
                    {
                        let validation = 
                        {
                            date: moment(date).isValid(), 
                            time: moment(time, "HH:mm").isValid(), 
                            number: Number(number)>=current_reading
                        }
                        return !Object.values(validation).includes(false); 
                    }
                ); 
                return valid.length==this.utilities_readings.length?                
                this.utilities_readings.map 
                (
                    ({apartment_name, service, current_reading, ...rest })=>rest 
                ): 
                false; 
            }
        },
        methods: 
        {
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

            }, 
            NewUtilityReadingValue(event)
            {
                let index = $(event.target).attr("data-index"); 
                let property = $(event.target).attr("data-property"); 
                let value = $(event.target).text(); 
                
                this.utilities_readings[index][property] = value; 
                $(event.target).text(value); 
                
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
                                <th>Remove</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(reading, index) in UtilitiesReadingDisplay">
                                <td v-for="property in Object.keys(reading)">
                                    <p 
                                        :contenteditable="contenteditable.includes(property)" 
                                        :data-index="index"
                                        :data-property="property"
                                        @blur="NewUtilityReadingValue"
                                    >{{reading[property]}}</p>
                                </td>
                                <td class="text-center">
                                    <button 
                                        class="btn" 
                                        @click="utilities_readings = utilities_readings.filter((value, i)=>i!=index)"
                                    ><i style="font-size: xx-large;" class="fas fa-trash-alt"></i></button>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <div class="row text-right" v-if="UtilitiesReadingValid">
                        <div class="col">
                            <button class="btn" title="Add New Readings">
                                <i style="font-size: xx-large;" class="fas fa-arrow-alt-circle-right"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `
    }    
); 


// conteneditable div does not change 
// the delete button does not get rid of the bad content editable div 
