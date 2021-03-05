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
}