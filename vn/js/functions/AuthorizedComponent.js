class AuthorizedComponent extends BaseComponent
{
    constructor(props)
    {
        super(props); 
        console.log(this); 
        let methods = _.cloneDeep(this.Methods); 
        console.log(methods); 
        console.log(this.Methods); 
        ExtendFromBaseComponent(this); 
        this.PageWrapperUpdate(); 
    }
    componentDidUpdate(previous_props, previous_state)
    {
        this.PageWrapperUpdate(); 
    }
    Methods = 
    {
        PageWrapperUpdate()
        {
            Emitter.emit("pageWrapperUpdate", _.get(this.props, "match.params.building_id")); 
        }
    }
}