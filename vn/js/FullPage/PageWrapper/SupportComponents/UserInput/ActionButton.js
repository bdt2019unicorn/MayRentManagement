class SubmitButton extends React.Component 
{
    render() 
    {
        return (
            <MaterialUI.IconButton 
                className="float-right" 
                title={this.props.title} 
                type={this.props.type || "submit"} 
                onClick={this.props.SubmitButtonClick?()=>this.props.SubmitButtonClick(): null}
            >
                <MaterialUI.Icon>{this.props.icon || "arrow_forward"}</MaterialUI.Icon>
            </MaterialUI.IconButton>
        );
    }
}