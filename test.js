var start_period = "2018-6-21"; 
var end_period = "2018-7-25"; 


[start_period, end_period] = [start_period, end_period].map(period=>moment(period)); 
var string = `end_period.diff(start_period, "months", true)/2; `;
eval(string);  
end_period.diff(start_period, "months", true)/2; 
end_period.diff(start_period, "2 months", true); 

var number = 2937600000; 
var duration = moment.duration(number); 
duration.as("months"); 