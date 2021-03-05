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
}