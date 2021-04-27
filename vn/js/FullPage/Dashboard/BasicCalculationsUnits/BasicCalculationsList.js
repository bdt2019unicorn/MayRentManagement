class BasicCalculationsList extends React.Component
{
    render()
    {
        var IconButton = MaterialUI.IconButton; 
        var Icon = MaterialUI.Icon; 
        return (
            <div>
                <ul className="list-unstyle pt-4">
                    {
                        this.props.basic_calculations.map 
                        (
                            ({id, name})=>
                            (
                                <li key={id} className="box-shadow-extra-large rounded-2 mt-4 mb-4 d-flex flex-justify-between">
                                    <span>{name}</span>
                                    <div>
                                        <IconButton size="small" title="Chỉnh sửa"><Icon>edit_outlined</Icon></IconButton>
                                        <IconButton size="small" title="Xóa" color="secondary" onClick={()=>this.props.DeleteBasicUnit(id)}><Icon>delete</Icon></IconButton>
                                    </div>
                                </li>
                            )
                        )
                    }
                </ul>
            </div>
        ); 
    }
}