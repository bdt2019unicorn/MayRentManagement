class BasicCalculationsForm extends React.Component 
{
    render()
    {
        constructor(props)
        {
            super(props); 
            this.input_ref = React.createRef(); 
        }
        return (
            <div>
                <form onSubmit={this.props.SubmitForm}>
                    <div className="d-flex flex-justify-between">
                        <div className="pl-4" style={{width: "80%"}}>
                            <input ref={this.input_ref} className="width-full border-black-fade bg-blue text-white" name="name" type="text" onChange={this.props.EditTextChanged} />
                        </div>
                        <div>
                            <SubmitButton class="btn btn-primary circle ml-1 mr-1 p-1" icon={this.props.edit_id?"edit":"add"}/>
                            <SubmitButton type="button" class="btn btn-danger circle ml-1 mr-1 p-1" icon="cancel" SubmitButtonClick=
                            {
                                ()=>
                                {
                                    this.props.Cancel(); 
                                    this.input_ref.current; 
                                }
                            }/>
                        </div>
                    </div>
                </form>
            </div>
        ); 
    }
}