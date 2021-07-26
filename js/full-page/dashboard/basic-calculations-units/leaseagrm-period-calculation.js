Vue.component
(
    "leaseagrm-period-calculation", 
    {
        props: ["basic_calculations", "edit_data", "edit_text"], 
        data: () =>
        (
            {
                number: undefined, 
                operation: undefined, 
                operations: 
                [
                    {value: "+", text: "plus (+)"}, 
                    {value: "-", text: "minus (-)"}, 
                    {value: "*", text: "multiply (x)"}, 
                    {value: "/", text: "divide (:)"}
                ], 
                unit: undefined
            }
        ),
        components: {...vueFragment}, 
        computed: 
        {
            CalculationMethod()
            {
                if(this.IsBasic || !this.unit)
                {
                    return undefined; 
                }
                var number = this.operation?(this.number||0): undefined; 
                let script = `end_period.diff(start_period, "${this.unit}", true)${this.operation || ""}${number==undefined? "": number};`; 

                let {start_period, end_period} = this.TestPeriod; 
                var test_result; 
                eval(`test_result = ${script}`); 
                if((test_result === Infinity) || !test_result) 
                {
                    return undefined; 
                }
                return script; 
            }, 
            IsBasic()
            {
                let {start_period, end_period} = this.TestPeriod; 
                var bad_diff = end_period.diff(start_period); 
                var current_diff = end_period.diff(start_period, this.edit_text, true); 
                return !(bad_diff==current_diff); 
            }, 
            RevertMethod()
            {
                if(!this.CalculationMethod)
                {
                    return undefined; 
                }
                var script = `start_period.clone().add("${this.unit}",`; 
                let number = Number(this.number)||0; 
                var operation = ""; 
                if(["*", "/"].includes(this.operation))
                {
                    if(number)
                    {
                        operation = this.operation == "*" ? "/" : "*"; 
                    }
                    else 
                    {
                        return undefined; 
                    }
                }
                else 
                {
                    operation = this.operation == "+" ? "-" : "+"; 
                }
                return `${script} diff${operation}${number});`; 
            }, 
            TestPeriod()
            {
                return {
                    start_period: moment(), 
                    end_period: moment().add(1, "year")
                }; 
            }
        }, 
        created()
        {
            if(this.edit_data)
            {
                if(Number(this.edit_data.is_basic))
                {
                    return; 
                }

                var calculation_method = this.edit_data.calculation_method; 
                if(!calculation_method)
                {
                    return; 
                }

                this.unit = calculation_method.match('"\\w+"')[0].replaceAll('"', ''); 
                this.operation = calculation_method.match('\\)\\W')[0].replaceAll(')', '');
                this.number = calculation_method.match('\\d+')[0]; 
            }
        }, 
        template: 
        `
            <fragment>
                <div class="col-10 row">
                    <div class="col align-self-center"><p><b>Difference in</b></p></div>
                    <select-input 
                        :select_data="basic_calculations.filter(({is_basic})=>Number(is_basic)).map(({name})=>name)"
                        :lock="IsBasic"
                        v-model="unit"
                    ></select-input>
                    <select-input 
                        :select_data="operations" 
                        :lock="IsBasic"
                        select_value="value" 
                        text="text"
                        v-model="operation"
                    ></select-input>
                    <number-input 
                        :value="number" 
                        :lock="IsBasic"
                        v-model="number"
                    ></number-input>
                </div>
                <checkbox-input 
                    class="align-self-center" 
                    :lock="true" 
                    name="is_basic" 
                    :checked="IsBasic" 
                    title="Basic Unit"
                ></checkbox-input>
                <input type="hidden" name="calculation_method" v-model="CalculationMethod" />
                <input type="hidden" name="revert_method" v-model="RevertMethod" />
            </fragment>
        `
    }
); 
