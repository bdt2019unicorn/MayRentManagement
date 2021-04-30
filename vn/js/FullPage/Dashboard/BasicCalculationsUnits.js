class BasicCalculationsUnits extends BaseComponent
{
    constructor(props)
    {
        super(props); 
        BindFunctions(this); 
        this.state = 
        {
            basic_calculations: [], 
            current_table: undefined, 
            edit_data: undefined, 
            edit_id: undefined, 
            edit_text: "", 
            extra_edit: true, 
            special_tables: ["leaseagrm_period", "revenue_type"], 
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
        }; 
    }
    Methods = 
    {
        BasicCalculations(overview_controller = undefined)
        {
            overview_controller = overview_controller || this.OverviewController(); 
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
        EditData(id = undefined, name=undefined)
        {
            id = id || this.state.edit_id; 
            name = name || this.state.edit_text; 
            return this.state.basic_calculations.find(element=> (element.id ==id) && (element.name==name));
        }, 
        ExtraEditReset()
        {
            this.ResetStateValue({value_name: "extra_edit", new_value: true}); 
        }, 
        GeneralEditButtonClick(id, name)
        {
            this.setState
            (
                {
                    edit_id: id, 
                    edit_text: name, 
                    edit_data: this.EditData(id, name)
                }
            ); 
        }, 
        HandleResult(result)
        {
            if(Number(result))
            {
                this.ExtraEditReset(); 
                this.setState({basic_calculations: this.BasicCalculations()}); 
                this.GeneralEditButtonClick(undefined, ""); 
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
            var data = this.state.special_tables.includes(this.OverviewController())? Object.fromEntries(new FormData(event.currentTarget)): {name: this.state.edit_text}; 
            var url = this.ServerUrl(this.state.edit_id?"edit": "import", this.state.edit_id); 
            var result = SubmitData(this.state.edit_id?"edit":"excel", url, this.state.edit_id?data:[data]); 
            this.HandleResult(result); 
        }
    }
    render()
    {
        var overview_controller = this.OverviewController(); 
        return (
            <div>
                <Dropdown
                    id="width-full select-center-text"
                    title="Chọn đơn vị tính toán"
                    searchable={["Tìm kiếm đơn vị tính toán", "Không có đơn vị tính toán"]}
                    list={this.state.tables}
                    onChange=
                    {
                        item=>this.setState
                        (
                            {
                                current_table: item, 
                                basic_calculations: this.BasicCalculations(item.value), 
                                edit_data: undefined, 
                                edit_id: undefined, 
                                edit_text: ""
                            }
                        )
                    }
                />
                <br />
                {
                    overview_controller && !this.state.unable_to_delete &&  
                    (
                        <div>
                            <BasicCalculationsForm
                                edit_id={this.state.edit_id}
                                edit_text={this.state.edit_text}
                                SubmitForm={this.SubmitForm}
                                EditTextChanged={(event)=>this.setState({edit_text: event.currentTarget.value})}
                                Cancel={()=>this.GeneralEditButtonClick(undefined, "")}
                            >
                                {
                                    this.state.special_tables.includes(overview_controller) && 
                                    (
                                        <div>
                                            {overview_controller == "revenue_type" && this.state.extra_edit && <RevenueTypeCalculation edit_data={this.state.edit_data} />}
                                            {overview_controller == "leaseagrm_period" && this.state.extra_edit && <LeaseagrmPeriodCalculation basic_calculations={this.state.basic_calculations} edit_data={this.state.edit_data} edit_text={this.state.edit_text} />}
                                        </div>
                                    )
                                }
                            </BasicCalculationsForm>
                            <BasicCalculationsList  
                                basic_calculations={this.state.basic_calculations}
                                GeneralEditButtonClick={this.GeneralEditButtonClick}
                                DeleteBasicUnit={this.DeleteBasicUnit}
                            />
                        </div>
                    )
                }
                {
                    this.state.unable_to_delete && 
                    <UnableToDelete 
                        unable_to_delete={this.state.unable_to_delete}
                        ActionButtonClick={()=>this.setState({unable_to_delete: undefined})}
                    />
                }
            </div>
        ); 
    }
}