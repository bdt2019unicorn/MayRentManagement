class SubmitButton extends React.Component 
{
    constructor(props)
    {
        super(props); 
        BindFunctions(this); 
    }
    Methods =  
    {
        Test(event)
        {
            console.log(event.target.value); 
        }
    }
    render() 
    {
        return (
            <MaterialUI.IconButton className="float-right" title={this.props.title|| "Submit"}>
                <MaterialUI.Icon>{this.props.icon || "arrow_forward"}</MaterialUI.Icon>
            </MaterialUI.IconButton>
        );
    }
}