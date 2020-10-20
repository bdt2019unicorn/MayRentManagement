function BindFucntions(component)
{
    let support_functions = new component.SupportFunction(); 
    Object.keys(support_functions).forEach(func=>component[func] = support_functions[func].bind(component)); 
}