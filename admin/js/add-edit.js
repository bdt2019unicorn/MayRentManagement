function ActionFails(action)
{
    alert(`${action} ${url_params.get("table")} Fails! There seems to be some server issue`);  
}

function AddEdit(event)
{
    event.preventDefault();
    var form_element = event.currentTarget; 
    var data = $(form_element).serializeObject(); 
    if($("#number-of-forms").length)
    {
        let result = ImportDatabase([data]); 
        if(Number(result))
        {
            alert(`Add ${url_params.get("table")} Success!`); 
            var number = $("#number-of-forms").val(); 
            if(number==1)
            {
                window.location.href = `.?table=${url_params.get("table")}`; 
            }
            else
            {
                $(form_element).remove();                 
                $("#number-of-forms").val(number -1); 
            }
        }
        else 
        {
            ActionFails("Add"); 
        }
    }
    else 
    {
        var url = `../server/database_controller/edit.php?table=${url_params.get("table")}&id=${data.id}`; 
        delete data.id; 
        let result = support_mixin.methods.SubmitData("edit", url, data); 
        if(Number(result))
        {
            alert("Edit data success!"); 
        }
        else
        {
            ActionFails("Edit"); 
        }
    }
}

function AddEditAll()
{
    var all_forms = $("#main-forms").children(); 
    var data = []; 
    all_forms.each 
    (
        function()
        {
            let object = $(this).serializeArray().filter(({name, value})=>value);
            if(object.length)
            {
                let result = object.map(({name, value})=>({[name]: value})).reduce 
                (
                    (accumulator, current_value)=>({...accumulator, ...current_value})
                ); 
                data.push(result); 
            } 
        }
    ); 
    
    var ActionResult = (result, action)=>
    {
        console.log(result); 
        if(Number(result))
        {
            alert(`${action} all ${url_params.get("table")} Success!`); 
            window.location.href = `.?table=${url_params.get("table")}`; 
        }
        else 
        {
            ActionFails(action); 
        }
    }
    
    if($("#number-of-forms").length)
    {
        let result = ImportDatabase(data); 
        ActionResult(result, "Add"); 
    }
    else 
    {
        data = data.map(({id, ...rest})=>({[id]: rest})).reduce((accumulator, current_value)=>({...accumulator, ...current_value}), {});
        let url = `../server/admin_database.php?command=EditAll&table=${url_params.get("table")}`; 
        let result = support_mixin.methods.SubmitData("edit_all", url, data); 
        ActionResult(result, "Edit"); 
    }
}

function ImportDatabase(data)
{
    let url = `../server/database_controller/import.php?import_controller=${url_params.get("table")}`;
    return support_mixin.methods.SubmitData("excel", url, data); 
}

function NumberOfInsertChanged(input)
{
    var number = Number(input.value); 
    InsertForm(number); 
}

function InsertForm(number)
{
    var main_form = $("#main-forms"); 
    var children = main_form.children(); 
    let append_number = number - children.length; 
    if(append_number>0)
    {
        main_form.append(new Array(append_number).fill(form)); 
    }
    else
    {
        append_number = Math.abs(append_number); 
        let remove = 0; 
        let remove_list = []; 
        for (let index = 0; index < children.length; index++) 
        {
            let form_element = children[index]; 
            var form_data = $(form_element).serializeArray(); 
            let total_data = form_data.filter(({name, value})=>(value.trim()!="")); 
            if(total_data.length)
            {
                remove_list.push(form_element); 
            }
            else 
            {
                $(form_element).remove(); 
                remove++; 
                if(remove==append_number)
                {
                    break; 
                }
            }
        }

        if(remove<append_number)
        {
            let top_remove_index = remove_list.length - 1 - (append_number - remove); 
            remove_list.filter((form_element, index)=>index>top_remove_index).forEach 
            (
                form_element=>$(form_element).remove() 
            ); 
        }
    }

}

jQuery 
(
    function()
    {
        var number_of_form_input = $("#number-of-forms"); 
        
        if(number_of_form_input.length)
        {
            number_of_form_input.val(1); 
            InsertForm(1); 
        }
        else 
        {
            $("#main-forms").append(form); 
        }
    }
); 