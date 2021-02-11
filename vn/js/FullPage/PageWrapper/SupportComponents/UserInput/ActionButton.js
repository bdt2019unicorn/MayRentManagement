class SubmitButton extends React.Component 
{
    constructor(props)
    {
        super(props); 
        BindFunctions(this); 
    }
    render() 
    {
        return (
            <MaterialUI.IconButton className="float-right" title={this.props.title|| "Submit"} type={this.props.type || "submit"}>
                <MaterialUI.Icon>{this.props.icon || "arrow_forward"}</MaterialUI.Icon>
            </MaterialUI.IconButton>
        );
    }
}