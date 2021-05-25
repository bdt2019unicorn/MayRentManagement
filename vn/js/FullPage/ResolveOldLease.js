class ResolveOldLease extends PageWrapperChildrenComponent {
  constructor(props) {
    super(props);
    BindFunctions(this);
    this.state = {
      mangHopDongCu: this.LoadOldLeases(),
      isValid: true,
    };
    this.rentInvoice = new RentInvoice();
  }

  Methods = {
    LoadOldLeases() {
      let url = this.ServerUrl("LoadOldLeases");
      let data = AjaxRequest(url);
      try {
        return this.OldLeasesJson(data);
      } catch (exception) {
        return [];
      }
    },
    OldLeasesJson(data) {
      return JSON.parse(data).map((leaseagrm) => ({
        ...leaseagrm,
        show_details: false,
      }));
    },
    ServerUrl(command) {
      return `../server/controller/overview/resolve_old_contract.php?command=${command}&building_id=${this.BuildingId()}`;
    },
  };

  handleDelete = (id) => {
    const { mangHopDongCu } = this.state;
    let newMangHopDongCu = [...mangHopDongCu];
    let indexHD = newMangHopDongCu.findIndex((hopDong) => hopDong.id === id);

    if (indexHD !== -1) {
      newMangHopDongCu.splice(indexHD, 1);
    }

    this.setState({
      mangHopDongCu: newMangHopDongCu,
    });
  };

  handleCheckDate = (check)=>{
    this.setState({
      isValid: check,
    }, ()=>{console.log(this.state)})
  }

  render() {
    const { Container, Box } = MaterialUI;
    const { mangHopDongCu, isValid } = this.state;

    // console.log(mangHopDongCu);

    return (
      <Container>
        <h1>Xử lý hợp đồng cũ</h1>
        {mangHopDongCu.map((hopDong, index) => {
          return (
            <ResolveOldLease_content
              rentInvoice={this.rentInvoice}
              hopDong={hopDong}
              key={index}
              handleDelete={this.handleDelete}
              handleCheckDate = {this.handleCheckDate}
              isValid = {isValid}
              DateChargedUntilChanged={(date) => {
                var mangHopDongCuMoi = ImmutabilityHelper(mangHopDongCu, {
                  [index]: {
                    date_charged_until: {
                      $set: moment(date).format("YYYY-MM-DD"),
                    },
                  },
                });
                this.setState({ mangHopDongCu: mangHopDongCuMoi });
              }}
            />
          );
        })}
        <Box component="span" display={isValid ? "block" : "none"}>
          <SubmitButton type="button" />
        </Box>
      </Container>
    );
  }
}
