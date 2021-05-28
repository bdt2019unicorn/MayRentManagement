class ResolveOldLease extends PageWrapperChildrenComponent {
  constructor(props) {
    super(props);
    BindFunctions(this);
    this.state = {
      mangHopDongCu: this.LoadOldLeases(),
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

  componentDidMount() {
    const newArray = this.state.mangHopDongCu.map((hopDong) => ({
      ...hopDong,
      isHDValid: true,
    }));
    this.setState({
      mangHopDongCu: newArray,
    });
  }

  handleSubmit = () => {
    OldLeasesValid();
    {
      let old_leases_submit = this.old_leases.filter(
        (leaseagrm) => !this.DateChargedUntilInvalid(leaseagrm)
      );
      return old_leases_submit.length == this.old_leases.length
        ? old_leases_submit.map(
            ({
              id,
              name,
              Start_date,
              date_charged_until,
              leaseagrm_period,
              Rent_amount,
              utilities,
            }) => {
              let quantity = this.RentQuantityCalculation(
                Start_date,
                date_charged_until,
                leaseagrm_period
              );
              let amount = Rent_amount * quantity;
              let date_charged_until_moment = moment(date_charged_until);
              let utilities_details = Object.values(utilities)
                .flatMap((object) => Object.values(object))
                .filter(({ date }) => moment(date) <= date_charged_until_moment)
                .map(
                  ({
                    utility_reading_id,
                    revenue_type_id,
                    price,
                    quantity,
                    amount,
                    revenue_type,
                    date,
                    previous_date,
                  }) => ({
                    name: `${name} - Resolve ${revenue_type} Period ${this.DateReformatDisplay(
                      previous_date
                    )} - ${this.DateReformatDisplay(date)}`,
                    utility_reading_id,
                    revenue_type_id,
                    price,
                    quantity,
                    amount,
                  })
                );
              let utilities_total = utilities_details.reduce(
                (accumulator, { amount }) => accumulator + Number(amount),
                0
              );
              return {
                id,
                name,
                start_date: Start_date,
                date_charged_until:
                  this.DateReformatDatabase(date_charged_until),
                price: Rent_amount,
                quantity,
                amount: amount.toFixed(3),
                utilities: utilities_details,
                total: utilities_total + amount,
              };
            }
          )
        : undefined;
    }
  };

  render() {
    const { Container, Box } = MaterialUI;
    const { mangHopDongCu } = this.state;

    const checkSubmit = () => {
      let check = true;
      for (const hopDong of mangHopDongCu) {
        check &= hopDong.isHDValid;
      }
      return check;
    };

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
              checkSubmit={this.checkSubmit}
              handleCheckDate={(check) => {
                var mangHopDongCuMoi = ImmutabilityHelper(mangHopDongCu, {
                  [index]: {
                    isHDValid: {
                      $set: check,
                    },
                  },
                });
                this.setState({ mangHopDongCu: mangHopDongCuMoi });
              }}
            />
          );
        })}
        <Box component="span" display={checkSubmit() ? "block" : "none"}>
          <SubmitButton type="button" SubmitButtonClick={this.handleSubmit} />
        </Box>
      </Container>
    );
  }
}
