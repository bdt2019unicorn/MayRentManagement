class BaseHyperlink extends React.Component
{
    render()
    {
        var Link = ReactRouterDOM.Link; 
        return (
            <Link to={this.props.to}>
                {TranslationValues.Translate(this.props.text) || null}
            </Link> 
        ); 
    }
}

class Hyperlink extends React.Component 
{
    render() 
    {
        if(!this.props.html)
        {
            return null; 
        }
        let {action, controller, object_id} = this.props.special; 
        object_id = this.props.row[object_id]; 
        return <BaseHyperlink 
            to=
            {
                ToActions
                (
                    {
                        params: {building_id: this.props.append, action, controller}, 
                        query: {id: object_id}
                    }
                )
            }
            text={this.props.html}
        />; 
    }
}