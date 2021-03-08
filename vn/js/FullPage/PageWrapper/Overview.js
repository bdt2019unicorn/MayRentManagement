class Overview extends PageWrapperChildrenComponent
{
    constructor(props)
    {
        super(props); 
        BindFunctions(this); 
    }
    render() 
    {
        return (
            <div>
                Overview
                <pre>
                    {JSON.stringify(this.props, null, 2)}
                </pre>
            </div>         
        );
    }
}