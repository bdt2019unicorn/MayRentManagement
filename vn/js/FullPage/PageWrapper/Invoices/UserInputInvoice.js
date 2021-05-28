class UserInputInvoice extends React.Component 
{
    render()
    {
        let {title} = this.props; 
        return (
            <MaterialUI.Container>
                <h1>{title}</h1>
            </MaterialUI.Container>
        ); 
    }
}