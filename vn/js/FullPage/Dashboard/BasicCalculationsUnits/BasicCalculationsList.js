class BasicCalculationsList extends React.Component
{
    render()
    {
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
                                        <ActionButton size="small" title="Chỉnh sửa" icon="edit_outlined" ActionButtonClick={()=>this.props.GeneralEditButtonClick(id, name)} />
                                        <ActionButton size="small" title="Xóa" color="secondary" icon="delete" ActionButtonClick={()=>this.props.DeleteBasicUnit(id)} />
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