/*
function BindFucntions(component)
{
    let support_functions = new component.SupportFunction(component); 
    Object.keys(support_functions).forEach(func=>component[func] = support_functions[func].bind(component)); 
}

*/

function BindFucntionsTest(component)
{
    Object.keys(component.Methods).forEach(func=>component[func] = component.Methods[func].bind(component)); 
}