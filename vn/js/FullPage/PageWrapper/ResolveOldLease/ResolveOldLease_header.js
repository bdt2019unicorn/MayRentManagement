class ResolveOldLease_header extends PageWrapperChildrenComponent {
  render() {
    const { hopDong } = this.props;
    const { Typography } = MaterialUI;

    const ngayTraDenKhi = moment(hopDong.date_charged_until).format(
      "DD-MM-YYYY"
    );
    const ngayBatDau = moment(hopDong.Start_date).format("DD-MM-YYYY");
    const ngayKetThuc = moment(hopDong.Finish).format("DD-MM-YYYY");
    
    const changeColor = ()=>{
      // console.log(hopDong.isHDValid);
      if(!hopDong.isHDValid){
        return "error";
      }
      return "initial";
    }
    return (
      <div>
        <Typography variant="subtitle1" gutterBottom>
          Ngày bắt đầu hợp đồng: {ngayBatDau}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Ngày kết thúc hợp đồng: {ngayKetThuc}
        </Typography>
        <Typography variant="subtitle1" color={changeColor()} gutterBottom>
          Trả đến khi: {ngayTraDenKhi}
        </Typography>
      </div>
    );
  }
}
