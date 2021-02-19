class PageWrapperChildrenComponent extends BaseComponent
{
    constructor(props)
    {
        super(props); 
        PageWrapperChildrenComponent.Methods = {...PageWrapperChildrenComponent.Methods, ...BaseComponent.Methods}; 
    }
    static Methods = 
    {
        PageControllerUpdate()
        {
            Emitter.emit("pageControllerUpdate", _.get(this.props, "match.params.controller")); 
        }
    }
}