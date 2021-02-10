const Emitter = new EventEmitter();
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
            var setup = new PageSetup(); 
            ReactDOM.render(setup.FullPage(), document.getElementById("full_page"));
        }
        else 
        {
            window.location.href = "../admin/setup.php"; 
        }
    }
); 