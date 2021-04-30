class BasicCalculationsForm extends React.Component 
{
    render()
    {
        return (
            <div>
                <form onSubmit={this.props.SubmitForm}>
                    <div className="d-flex flex-justify-between">
                        <div className="pl-4 w-80">
                            <input className="width-full border-black-fade bg-blue text-white" name="name" type="text" onChange={this.props.EditTextChanged} value={this.props.edit_text} />
                        </div>
                        <div>
                            <SubmitButton class="btn btn-primary circle ml-1 mr-1 p-1" icon={this.props.edit_id?"edit":"add"}/>
                            <ActionButton class="btn btn-danger circle ml-1 mr-1 p-1" icon="cancel" ActionButtonClick={this.props.Cancel}/>
                        </div>
                    </div>
                    {this.props.children}
                </form>
            </div>
        ); 
    }
}