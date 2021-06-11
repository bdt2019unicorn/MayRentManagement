class ResolveOldLease extends PageWrapperChildrenComponent {
  constructor(props) {
    super(props);
    this.state = {
      mangHopDongCu: this.LoadOldLeases(),
    };
    this.rentInvoice = new RentInvoice();
  }

  LoadOldLeases = () => {
    let url = this.ServerUrl("LoadOldLeases");
    let data = AjaxRequest(url);
    try {
      return this.OldLeasesJson(data);
    } catch (exception) {
      return [];
    }
  };

  OldLeasesJson = (data) => {
    return JSON.parse(data).map((leaseagrm) => ({
      ...leaseagrm,
      show_details: false
    }));
  };

  ServerUrl = (command) => {
    return `../server/controller/overview/resolve_old_contract.php?command=${command}&building_id=${this.BuildingId()}`;
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
      isHDValid: true
    }));
    this.setState({
      mangHopDongCu: newArray
    });
  }

  handleSubmit = () => {
    const old_leases_submit = this.state.mangHopDongCu.filter(
      (leaseagrm) => leaseagrm.isHDValid === true
    );
    const data = old_leases_submit.map(
      ({
        id,
        name,
        Start_date,
        date_charged_until,
        leaseagrm_period,
        Rent_amount,
        utilities
      }) => {
        let quantity = this.rentInvoice.RentQuantityCalculation(
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
              previous_date
            }) => ({
              name: `${name} - Giải quyết ${revenue_type} kỳ thanh toán ${DateReformat.Display(
                previous_date
              )} - ${DateReformat.Display(date)}`,
              utility_reading_id,
              revenue_type_id,
              price,
              quantity,
              amount
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
          date_charged_until: DateReformat.Database(date_charged_until),
          price: Rent_amount,
          quantity,
          amount: amount.toFixed(3),
          utilities: utilities_details,
          total: utilities_total + amount
        };
      }
    );

    let url = this.ServerUrl("ResolveOldLeases");
    const result = SubmitData("old_leases", url, data);
    try {
      this.OldLeasesJson(result);
      alert("Cập nhật thành công! Tất cả các hợp đồng cũ đều được cập nhật");
    } catch (error) {
      alert(
        "Giải quyết tất cả các hợp đồng không thành công. Có vẻ như có sự cố với máy chủ."
      );
    }
  };

  render() {
    const { Container, Box, Typography } = MaterialUI;
    const { mangHopDongCu } = this.state;

    const checkSubmit = () => {
      let check = true;
      for (const hopDong of mangHopDongCu) {
        check &= hopDong.isHDValid;
      }
      return check;
    };

    const renderHopDong = () => {
      const { mangHopDongCu } = this.state;

      return mangHopDongCu.map((hopDong, index) => {
        return (
          <ResolveOldLeaseContent
            rentInvoice={this.rentInvoice}
            hopDong={hopDong}
            key={index}
            handleDelete={this.handleDelete}
            DateChargedUntilChanged={(date) => {
              var mangHopDongCuMoi = ImmutabilityHelper(mangHopDongCu, {
                [index]: {
                  date_charged_until: {
                    $set: DateReformat.Database(date)
                  }
                }
              });
              this.setState({ mangHopDongCu: mangHopDongCuMoi });
            }}
            checkSubmit={this.checkSubmit}
            handleCheckDate={(check) => {
              var mangHopDongCuMoi = ImmutabilityHelper(mangHopDongCu, {
                [index]: {
                  isHDValid: {
                    $set: check
                  }
                }
              });
              this.setState({ mangHopDongCu: mangHopDongCuMoi });
            }}
          />
        );
      });
    };

    const checkLength = () => {
      if (mangHopDongCu.length > 0) {
        return true;
      }
      return false;
    };

    const renderKhongCoHopDong = () => {
      return (
        <Box borderColor="secondary.main" border={3} padding={2} m={5}>
          <Typography variant="h4" color="error" >
            Hiện tại không có hợp đồng nào cần được xử lý tại căn này
          </Typography>
        </Box>
      );
    };
    return (
      <Container>
        <h1>Xử lý hợp đồng cũ</h1>
        {checkLength() ? renderHopDong() : renderKhongCoHopDong()}
        <Box
          component="span"
          display={checkSubmit() && checkLength() ? "block" : "none"}
        >
          <SubmitButton type="button" SubmitButtonClick={this.handleSubmit} />
        </Box>
      </Container>
    );
  }
}
