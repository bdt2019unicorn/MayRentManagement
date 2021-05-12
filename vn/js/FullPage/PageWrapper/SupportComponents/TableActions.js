class TableActions extends BaseComponent
{
    constructor(props)
    {
        super(props); 
        BindFunctions(this); 
    }
    Methods = 
    {
        Delete()
        {
            var url = `../server/controller/database/delete.php?table=${this.props.controller}`; 
            var result = SubmitData("delete", url, this.props.selected); 
            if(Number(result))
            {
                alert("Xóa dữ liệu thành công"); 
                this.ExecPropsFunction("DeleteSuccess"); 
            }
            else
            {
                alert("Xóa dữ liệu thất bại. Dường như đã có lỗi hệ thống"); 
            }
        }, 
        DeleteDuplicate()
        {
            var url = `../server/controller/database/delete_duplicate.php?controller=${this.props.controller}`; 
            var result = AjaxRequest(url); 
            if(result)
            {
                alert("Toàn bộ dữ liệu trùng đã bị xóa"); 
                this.ExecPropsFunction("DeleteSuccess"); 
            }
            else 
            {
                alert("Xóa dữ liệu trùng thất bại. Dường như đã có lỗi hệ thống"); 
            }
        }
    }
    render() 
    {
        var should_not_edit = this.props.selected.length!=1; 
        var edit_to = should_not_edit? undefined: ToActions
        (
            {
                params: this.props.params, 
                query: {id: this.props.selected[0]}
            }
        ); 
        var edit_btn = <MaterialUI.Button size="small" variant="contained" disabled={should_not_edit}>Chỉnh xửa</MaterialUI.Button>; 
        return (
            <div className="d-flex-right-push space-between-element">
                <MaterialUI.Button size="small" variant="contained" onClick={this.DeleteDuplicate}>Xóa dữ liệu trùng</MaterialUI.Button>
                <MaterialUI.Button size="small" variant="contained" color="secondary" onClick={this.Delete}>Xóa</MaterialUI.Button>
                {should_not_edit? edit_btn: <ReactRouterDOM.Link to={edit_to}>{edit_btn}</ReactRouterDOM.Link>}
            </div>
        );
    }
}