class ResolveOldLease extends PageWrapperChildrenComponent {
  constructor(props) {
    super(props);
    BindFunctions(this); 
    this.state = {
      mangHopDongCu: this.LoadOldLeases()
    };
    this.rentInvoice = new RentInvoice(); 
  }

  Methods =
  {
    LoadOldLeases()
    {
        let url = this.ServerUrl("LoadOldLeases"); 
        let data = AjaxRequest(url); 
        try 
        {
            return this.OldLeasesJson(data); 
        }
        catch (exception)
        {
            return []; 
        }
    }, 
    OldLeasesJson(data)
    {
        return JSON.parse(data).map(leaseagrm=>({...leaseagrm, show_details: false})); 
    }, 
    ServerUrl(command)
    {
        return `../server/controller/overview/resolve_old_contract.php?command=${command}&building_id=${this.BuildingId()}`; 
    }, 
  }

  render() {
    const {Container}=MaterialUI;
    const {mangHopDongCu} = this.state;
    
    return (
      <Container>
        <h1>Xử lý hợp đồng cũ</h1>
        {mangHopDongCu.map((hopDong, index)=>{
          return <ResolveOldLease_content 
                  rentInvoice={this.rentInvoice}
                  hopDong={hopDong} 
                  key={index} 
                  DateChargedUntilChanged=
                  {
                    (date)=>
                    {
                      var mangHopDongCuMoi = ImmutabilityHelper
                      (
                        mangHopDongCu, 
                        {
                          [index]: 
                          {
                            date_charged_until: {$set: moment(date).format("YYYY-MM-DD")} 
                          } 
                        }
                      ); 
                      this.setState({mangHopDongCu: mangHopDongCuMoi}); 
                    }

                  }
                />
        })}
      </Container>
    );
  }
}
