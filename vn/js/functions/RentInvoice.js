class RentInvoice
{
    constructor(leaseagrm_period=undefined)
    {
        this.leaseagrm_periods = leaseagrm_period || ServerJson("../server/controller/invoice/action.php?command=LeasearmPeriodsSepcial"); 
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