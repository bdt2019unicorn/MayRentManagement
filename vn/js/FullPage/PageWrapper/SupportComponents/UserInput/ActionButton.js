class SubmitButton extends React.Component 
{
    render() 
    {
        return (
            <MaterialUI.IconButton 
                className={this.props.class || "float-right"}
                title={this.props.title} 
                type={this.props.type || "submit"} 
                onClick={this.props.SubmitButtonClick?()=>this.props.SubmitButtonClick(): null}
            >
                <MaterialUI.Icon>{this.props.icon || "arrow_forward"}</MaterialUI.Icon>
            </MaterialUI.IconButton>
        );
    }
}

class ClearButton extends React.Component 
{
    render() 
    {
        var clear_button_style = 
        {
            width: "5%",
            position: "absolute",
            right: 0,
            top: this.props.error? "35%": "50%"
        }; 
        return (
            <MaterialUI.IconButton 
                size="small" 
                className="mr-3"
                style={clear_button_style}
                onClick={this.props.ClearButtonClick}
            >
                <MaterialUI.Icon fontSize="small">clear</MaterialUI.Icon>
            </MaterialUI.IconButton>
        );
    }
}