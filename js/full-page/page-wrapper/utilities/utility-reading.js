Vue.component
(
    "utility-reading", 
    {
        mixins: [utilities_mixin], 
        data: ()=> 
        (
            {
                unit_id: "", 
                contenteditable: ["date", "time", "number"], 
                utilities_readings: []
            }
        ),
        computed: 
        {
            UtilitiesReadingDisplay: ()=> this.utilities_readings.map 
            (
                ({revenue_type_id, unit_id, current_date, ...rest}) => 
                (
                    {

                        ...rest, 
                        current_date: current_date?this.DateReformatDisplay(current_date): ""
                    }
                )
            ), 
            
            UtilitiesReadingValid()
            {
                if(this.utilities_readings.length==0)
                {
                    return false; 
                }
                let valid = this.utilities_readings.filter
                (
                    ({date, time, number, current_reading, current_date, ...rest })=>
                    {
                        date = this.DateConvertFormatDisplayDatabase(date); 
                        let validation = 
                        {
                            date: moment(date).isValid(), 
                            time: moment(time, "HH:mm").isValid(), 
                            number: Number(number)>=current_reading, 
                            current_date: current_date?moment(current_date)<moment(date): true 
                        }
                        return !Object.values(validation).includes(false); 
                    }
                ); 
                return valid.length==this.utilities_readings.length?                
                this.utilities_readings.map 
                (
                    ({unit_name, service, current_reading, current_date, date, time, number, ...rest })=>
                    (
                        {
                            number: Number(number), 
                            date: `${this.DateReformatDatabase(date)} ${moment(time, "HH:mm").format("HH:mm:ss")}`,  
                            ...rest
                        }
                    ) 
                ): 
                false; 
            }
        },
        methods: 
        {
            UnitIdValueChanged: (new_value)=> new Promise 
            (
                (resolve, reject)=>
                {
                    this.unit_id = ""; 
                    resolve(); 
                }
            ).then 
            (
                ()=>
                {
                    this.unit_id = new_value;
                    try 
                    {
                        var current_readings = this.AjaxRequest(`${this.main_url}CurrentReadings&unit_id=${this.unit_id}`); 
                        current_readings = JSON.parse(current_readings); 
    
                        CurrentReading = function(revenue_type_id, look_up)
                        {
                            try 
                            {
                                return current_readings.find(reading=>reading.revenue_type_id==revenue_type_id)[look_up]; 
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
                                    unit_id: this.unit_id, 
                                    service: revenue_type.name, 
                                    unit_name: this.select_data.units.find(unit=>unit.id==this.unit_id).name, 
                                    date: this.DateReformatDisplay(), 
                                    time: moment().format("HH:mm"), 
                                    number: "", 
                                    current_reading: CurrentReading(revenue_type.id, "number"), 
                                    current_date: CurrentReading(revenue_type.id, "date")
                                }
                            )
                        ); 
                    } 
                    catch
                    {
                        this.utilities_readings = []; 
                    }
                }
            ), 
            DeleteUtilityReading: (remove_index)=> new Promise 
            (
                (resolve, reject)=>
                {
                    this.utilities_readings = this.utilities_readings.filter((value, index)=>index!=remove_index); 
                    let unit_id = this.unit_id; 
                    this.unit_id = ""; 
                    resolve(unit_id); 
                }
            ).then
            (
                (unit_id)=>
                {
                    if(this.utilities_readings.length==0)
                    {
                        new Promise 
                        (
                            (resolve, reject)=>
                            {
                                let units = R.clone(this.select_data.units); 
                                this.select_data.units = undefined; 
                                resolve(units); 
                            }
                        ).then 
                        (
                            (units)=>
                            {
                                this.select_data.units = units; 
                                this.unit_id = ""; 
                            }
                        ); 
                    }
                    else 
                    {
                        this.unit_id = unit_id; 
                    }
                }
            ), 

            NewUtilityReadingValue(event)
            {
                let index = $(event.target).attr("data-index"); 
                let property = $(event.target).attr("data-property"); 
                let value = $(event.target).text(); 
                
                this.utilities_readings[index][property] = value; 
                $(event.target).text(value); 
            }, 
            SubmitUtilitiesReading()
            {
                let result = this.SubmitData("excel", this.ImportUrl,this.UtilitiesReadingValid); 
                if(Number(result))
                {
                    alert("Add Reading Success"); 
                    this.UnitIdValueChanged(this.unit_id); 
                }
                else 
                {
                    alert("There seems like an issue with the server, please try again"); 
                }
            }
        },
        template:
        `
            <div class="container-fluid">
                <h1>Utilities</h1>
                <h6>Add new utility reading</h6>
                <div class="row" ref="units_select">
                    <select-input :select_data="select_data.units" v-bind="select_data" name="unit_id" not_required="true" @input="UnitIdValueChanged">All Units</select-input>
                </div>
                <div class="container-fluid" v-if="unit_id">
                    <table class="table table-striped table-bordered table-hover">
                        <thead class="thead-light">
                            <tr class="text-center">
                                <th>Service</th>
                                <th>Unit Name</th>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Reading</th>
                                <th>Previous Reading</th>
                                <th>Previous Date</th>
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
                                    <button class="btn" @click="DeleteUtilityReading(index)">
                                        <i style="font-size: xx-large;" class="fas fa-trash-alt"></i>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <div class="row text-right" v-if="UtilitiesReadingValid">
                        <div class="col">
                            <button class="btn" title="Add New Readings" @click="SubmitUtilitiesReading">
                                <i style="font-size: xx-large;" class="fas fa-arrow-alt-circle-right"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `
    }    
); 
