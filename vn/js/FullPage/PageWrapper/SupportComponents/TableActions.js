class TableActions extends React.Component
{
    constructor(props)
    {
        super(props); 
        BindFunctions(this); 
    }
    Methods = 
    {
        Delete(id)
        {

        }, 
        DeleteDuplicate()
        {

        }
    }
    render() 
    {
        return (
            <div className="d-flex-right-push space-between-element">
                <MaterialUI.Button size="small" variant="contained">Xóa dữ liệu trùng</MaterialUI.Button>
                <MaterialUI.Button size="small" variant="contained" color="secondary">Xóa</MaterialUI.Button>
                {<MaterialUI.Button size="small" variant="contained" disabled>Chỉnh xửa</MaterialUI.Button>}
            </div>
        );
    }
}