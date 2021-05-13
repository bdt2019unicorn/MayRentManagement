class ActionButton extends React.Component
{
    render()
    {
        return (
            <MaterialUI.IconButton 
                className={this.props.class || "float-right"}
                title={this.props.title} 
                type={this.props.type || "button"} 
                size={this.props.size}
                color={this.props.color}
                onClick={this.props.ActionButtonClick|| null}
            >
                <MaterialUI.Icon>{this.props.icon || "arrow_forward"}</MaterialUI.Icon>
            </MaterialUI.IconButton>
        );

    }
}

class SubmitButton extends React.Component 
{
    render() 
    {
        return (
            <ActionButton
                class={this.props.class}
                title={this.props.title} 
                type={this.props.type || "submit"} 
                icon={this.props.icon}
                ActionButtonClick={this.props.SubmitButtonClick|| null}
            />
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

class CloseButton extends React.Component
{
    render()
    {
        return (
            <div className="d-flex flex-justify-end p-3">
                <MaterialUI.IconButton onClick={this.props.onClick}><MaterialUI.Icon>close</MaterialUI.Icon></MaterialUI.IconButton>
            </div>
        ); 
    }
}