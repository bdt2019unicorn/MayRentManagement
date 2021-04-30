class UnableToDelete extends React.Component 
{
    render()
    {
        var unable_to_delete = this.props.unable_to_delete? Object.keys(this.props.unable_to_delete).reduce
        (
            (accumulator, current_value)=>
            {
                var table_name = this.props.unable_to_delete[current_value][0]["table_name"]; 
                return {
                    ...accumulator, 
                    [table_name]: this.props.unable_to_delete[current_value].map(({table_name, ...rest})=>rest) 
                }
            }, {}
        ): undefined; 
        return (
            <div className="border p-2">
                <div className="d-flex flex-justify-between">
                    <div className="text-red text-center width-full"><h2>Không thể xóa đơn vị! Vui lòng kiểm tra những bảng này</h2></div>
                    <div><ActionButton icon="cancel" title="Quay trở lại danh sách" ActionButtonClick={this.props.ActionButtonClick} /></div>
                </div>
                {
                    Object.keys(unable_to_delete).map 
                    (
                        table =>
                        (
                            <React.Fragment key={table}>
                                <h3 className="text-center">{table}</h3>
                                <ScrollingTable table={unable_to_delete[table]} />
                            </React.Fragment>
                        ) 
                    )
                }
            </div>
        ); 
    }
}