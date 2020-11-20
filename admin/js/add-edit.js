function AddEdit(event)
{
    event.preventDefault();
    console.log(event.currentTarget); 
    console.log(event); 
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
    }
); 