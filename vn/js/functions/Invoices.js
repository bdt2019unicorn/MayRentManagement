class Invoices extends PageWrapperChildrenComponent
{
    constructor(props)
    {
        super(props); 
        this.state = 
        {
            leaseagrm_select_data: [], 
            main_url: "../server/controller/invoice/action.php?command=", 
            revenue_type: 
            {
                leaseagrm: [], 
                utilities: []
            }, 
            user_input: {}
        } 
        let config = ServerJson(`${this.state.main_url}InvoiceConfigs&lang=vn&building_id=${this.props.current_building}`); 
        Object.keys(config).forEach(key=>this.state[key]=config[key]); 
    }
}

class UserInputInvoiceComponent extends BaseComponent 
{
    constructor(props)
    {
        super(props); 
        this.state = {invoice_details: []}; 
    }
    componentDidMount()
    {
        var {list, ValidInvoiceDetailsUpdate} = this.props; 
        this.PopulateList(list); 
        var valid_invoice_details = this.ValidInvoiceDetails(); 
        ValidInvoiceDetailsUpdate(valid_invoice_details); 
    }
    componentDidUpdate(previous_props, previous_state)
    {
        var valid_invoice_details = this.ValidInvoiceDetails(); 
        console.log(valid_invoice_details); 
    }
    
    // watch: 
    // {
    //     list: function(new_value, old_value)
    //     {
    //         this.PopulateList(new_value); 
    //     }, 
    //     ValidInvoiceDetails: function(new_value, old_value)
    //     {
    //         this.$emit("input", new_value); 
    //     }
    // }
}

class RentInvoice
{
    constructor(leaseagrm_period=undefined)
    {
        this.leaseagrm_periods = leaseagrm_period || ServerJson("../server/controller/invoice/action.php?command=LeasearmPeriodsSepcial"); 
    }
    PopulateRentInformation({revenue_type, price, rent_information, leaseagrm_period="months", user_input, leaseagrm_id=undefined})
    {
        let details = 
        {
            display: true, 
            revenue_type_id: revenue_type.id, 
            title: revenue_type.name, 
            valid: true, 
            price: Number(price)
        }; 

        if(leaseagrm_id)
        {
            details.leaseagrm_id = leaseagrm_id; 
        }

        let populate_rent_information = rent_information.map
        (
            ({start_date, end_date})=>
            {
                let row = _.cloneDeep(user_input.invoice_details.leaseagrm.form); 
                row[0].date_data.big_date.lock = Boolean(end_date); 
                let rent_end_date = end_date||this.invoice_information.leaseagrm["end_date"]; 
                return {
                    ...details, 
                    start_date: start_date, 
                    end_date: rent_end_date, 
                    quantity: this.RentQuantityCalculation(start_date, rent_end_date, leaseagrm_period), 
                    row: row 
                }; 
            }
        ); 

        return populate_rent_information.map
        (
            rent=>
            (
                {
                    ...rent, 
                    name: `${revenue_type.name} (${this.DateReformatDisplay(rent.start_date)} - ${this.DateReformatDisplay(rent.end_date)})`,
                    amount: this.NumeralFormat(rent.price * rent.quantity)
                }
            )
        ); 
    }
    RentQuantityCalculation(start_period, end_period, leaseagrm_period="months")
    {
        [start_period, end_period] = [start_period, end_period].map(period=>moment(period)); 
        let [str_start, str_end] = [start_period, end_period].map(moment_object=>DateReformatDatabase(moment_object)); 
        if(str_start==str_end)
        {
            return 0; 
        }
        start_period.subtract(1, "days"); 

        var script = this.leaseagrm_periods[leaseagrm_period] || "actual_result;"; 
        let actual_result = end_period.diff(start_period, leaseagrm_period, true); 
        eval(`actual_result = ${script}`); 
        return actual_result.toFixed(3); 
    } 
}

class ValidInvoiceDetails  
{
    
    static Leaseagrm(invoice_details)
    {
        if(!invoice_details.length)
        {
            return false; 
        }

        let leaseagrm = invoice_details.filter 
        (
            revenue_type=>
            {
                let validation = 
                {
                    valid: revenue_type.valid, 
                    period: ValidPeriod(revenue_type.start_date, revenue_type.end_date, true), 
                    price: numbro.unformat(revenue_type.price)>0,
                    quantity: revenue_type.quantity>0, 
                    amount: numbro.unformat(revenue_type.amount)>0
                }
                return ValidObject(validation); 
            }
        ).map(({name, revenue_type_id, start_date, end_date, price, quantity, amount})=>({name, revenue_type_id, start_date, end_date, price, quantity, amount: amount.toString().replaceAll(",","")})); 

        return (leaseagrm.length<invoice_details.length)?false: leaseagrm; 
    } 
    static Utilities(invoice_details, list=undefined)
    {
        if(list)
        {
            for (let index = 0; index < list.length; index++) 
            {
                let details = invoice_details.filter(({revenue_type_id})=>revenue_type_id==list[index].id); 
                if(!details.length)
                {
                    return false; 
                }
            }
        }
        var valid_details = invoice_details.filter(({amount})=> numbro.unformat(amount)>=0); 
        return (valid_details.length<invoice_details.length)? false: 
        invoice_details.map(({id, name, amount, price, quantity, revenue_type_id})=>({utility_reading_id: id, name, amount, price, quantity, revenue_type_id})); 
    }    
}