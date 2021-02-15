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
            <MaterialUI.IconButton className="float-right" title={this.props.title} type={this.props.type || "submit"} onClick={()=>Emitter.emit("submitButtonClick")}>
                <MaterialUI.Icon>{this.props.icon || "arrow_forward"}</MaterialUI.Icon>
            </MaterialUI.IconButton>
        );
    }
}