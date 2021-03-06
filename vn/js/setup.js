new Promise 
(
    (resolve, reject)=>
    {
        let result = AjaxRequest("../server/admin_database.php?command=CheckEnvironment"); 
        resolve(result); 
    }
).then 
(
    (result)=>
    {
        if(Number(result))
        {
            ValidationSetup(); 
            var setup = new PageSetup(); 
            ReactDOM.render(setup.FullPage(), document.getElementById("full_page"));
        }
        else 
        {
            window.location.href = "../admin/setup.php"; 
        }
    }
); 
function ValidationSetup()
{
    validate.validators.notRequiredEmail = function(value, options, key, attributes) 
    {
        if(!Boolean(value))
        {
            return undefined; 
        }
        var result = validate
        (
            attributes, 
            {
                [key]: 
                {
                    email: true 
                }
            }
        ); 
        return Boolean(result)? _.get(options, "message"): "Không phải địa chỉ email"; 
    };
    validate.validators.numeric = function(value, options, key, attributes)
    {
        var keys = Object.keys(options); 
        for (let key_name of keys) 
        {
            let rules = options[key_name]; 
            let rules_string = typeof(rules)=="string"; 
            let result = validate 
            ( 
                attributes, 
                {
                    [key]: 
                    {
                        numericality: 
                        {
                            [key_name]: rules_string? true : _.get(rules, "attribute")
                        }
                    }
                }
            ); 
            if(Boolean(result))
            {
                return rules_string? rules: _.get(rules, "message"); 
            }
        }
        return undefined; 
    }; 
    validate.validators.step = function(value, options, key, attributes)
    {
        let step = Number(_.get(options, "attribute")); 
        if(isNaN(step))
        {
            return undefined; 
        }
        value = Number(value); 
        var message = _.get(options, "message") || `Giá trị chia hết cho ${step}`; 
        if(isNaN(value))
        {
            return message; 
        }
        return (value%step) ? message: undefined; 
    }; 

    var DateGroupValidation = function(value, options, key, attributes, callback)
    {
        var presence = _.get(options, "presence"); 
        if(presence)
        {
            let result = validate
            (
                attributes, 
                {
                    [key]: 
                    {
                        presence: 
                        {
                            allowEmpty: false, 
                            message: presence
                        }
                    }
                }
            ); 
            if(result)
            {
                return presence; 
            }
        }
        else if(!value)
        {
            return undefined; 
        }

        
        var date_format = "DD/MM/YYYY"; 
        var DateCompare = function(options)
        {
            var date = document.getElementById(_.get(options, "attribute")); 
            var value = _.get(date, "value"); 
            console.log(value); 
            return value? moment(value, date_format) : undefined; 
        }; 


        var compare_date = DateCompare(options); 
        if(!compare_date)
        {
            return undefined; 
        }
        var current_date = moment(value, date_format); 
        return callback(current_date, compare_date); 
    }; 

    validate.validators.smallDate = function(value, options, key, attributes)
    {
        var callback = (current_date, compare_date)=>
        {
            var result = current_date.isSameOrBefore(compare_date); 
            return result ? undefined : (_.get(options, "message") || `${key} phải nhỏ hơn ${_.get(options, "attributes")}`);  
        }; 
        return DateGroupValidation(value, options, key, attributes, callback); 
    }; 
    validate.validators.bigDate = function(value, options, key, attributes)
    {
        var callback = (current_date, compare_date)=>
        {
            var result = current_date.isSameOrAfter(compare_date); 
            return result ? undefined : (_.get(options, "message") || `${key} phải lớn hơn ${_.get(options, "attributes")}`);  
        }; 
        return DateGroupValidation(value, options, key, attributes, callback); 
    }; 
}