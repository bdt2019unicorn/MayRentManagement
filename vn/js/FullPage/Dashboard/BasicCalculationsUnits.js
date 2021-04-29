class BasicCalculationsUnits extends BaseComponent
{
    constructor(props)
    {
        super(props); 
        BindFunctions(this); 
        this.state = 
        {
            current_table: undefined, 
            edit_id: undefined, 
            edit_text: undefined, 
            extra_edit: true, 
            special_tables: ['Loại thu nhập', 'Đơn vị thời gian thuê'], 
            tables: 
            [
                {
                    "label": "Loại tài liệu",
                    "value": "document_type"
                },
                {
                    "label": "Loại chi phí",
                    "value": "expense_type"
                },
                {
                    "label": "Đơn vị thời gian thuê",
                    "value": "leaseagrm_period"
                },
                {
                    "label": "Loại thu nhập",
                    "value": "revenue_type"
                }
            ], 
            unable_to_delete: undefined
        }
    }
    Methods = 
    {
        BasicCalculations()
        {
            let overview_controller = this.OverviewController(); 
            return overview_controller? this.TableData(overview_controller): []; 
        },  
        DeleteBasicUnit(id)
        {
            let url = this.ServerUrl("check_delete", id); 
            let result = AjaxRequest(url); 
            try 
            {
                this.setState({unable_to_delete: JSON.parse(result)}); 
            } 
            catch(exception)
            {
                url = this.ServerUrl("delete"); 
                result = SubmitData("delete", url, [id]); 
                this.HandleResult(result); 
            }
        }, 
        ExtraEditReset()
        {
            this.ResetStateValue({value_name: "extra_edit", new_value: true}); 
        }, 
        GeneralEditButtonClick(id, name)
        {
            this.setState({edit_id: id, edit_text: name}); 
        }, 
        HandleResult(result)
        {
            if(Number(result))
            {
                this.ExtraEditReset(); 
            }
            else
            {
                alert("Đã có lỗi hệ thống. Vui lòng thử lại."); 
            }
        }, 
        OverviewController()
        {
            return _.get(this.state.current_table, "value"); 
        }, 
        ServerUrl(command, id=undefined)
        {
            return `../server/controller/database/${command}.php?table=${this.OverviewController()}&id=${id}`; 
        }, 
        SubmitForm(event)
        {
            event.preventDefault(); 
            var data = this.state.special_tables.includes(this.state.current_table)? Object.fromEntries(new FormData(event.currentTarget)): {name: this.state.edit_text}; 
            var url = this.ServerUrl(this.edit_id?"edit": "import", this.edit_id); 
            var result = SubmitData(this.edit_id?"edit":"excel", url, this.edit_id?data:[data]); 
            this.HandleResult(result); 
        }
    }
    render()
    {
        var basic_calculations = this.BasicCalculations(); 
        var edit_data = basic_calculations.find(element=> (element.id ==this.state.edit_id) && (element.name==this.state.edit_text));
        return (
            <div>
                <Dropdown
                    id="width-full select-center-text"
                    title="Chọn đơn vị tính toán"
                    searchable={["Tìm kiếm đơn vị tính toán", "Không có đơn vị tính toán"]}
                    list={this.state.tables}
                    onChange={(item)=>this.setState({current_table: item})}
                />
                <br />
                {
                    this.state.current_table && !this.state.unable_to_delete &&  
                    (
                        <div>
                            <BasicCalculationsForm
                                edit_id={this.state.edit_id}
                                SubmitForm={this.SubmitForm}
                                EditTextChanged={(event)=>this.setState({edit_text: event.currentTarget.value})}
                                Cancel={()=>this.GeneralEditButtonClick(undefined, undefined)}
                            >

                            </BasicCalculationsForm>
                            <BasicCalculationsList  
                                basic_calculations={basic_calculations}
                                DeleteBasicUnit={this.DeleteBasicUnit}
                            />
                        </div>
                    )
                }
                {
                    this.state.unable_to_delete && 
                    <UnableToDelete 
                        unable_to_delete={this.state.unable_to_delete}
                        SubmitButtonClick={()=>this.setState({unable_to_delete: undefined})}
                    />
                }
            </div>
        ); 
    }
}