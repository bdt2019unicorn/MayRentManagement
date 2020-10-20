function BindFucntions(component)
{
    Object.keys(component.Methods).forEach(func=>component[func] = component.Methods[func].bind(component)); 
}