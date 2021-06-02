class ResolveOldLeaseHeader extends React.Component 
{
  render() {
    const { hopDong } = this.props;
    const { Typography } = MaterialUI;
    let [ngayTraDenKhi, ngayBatDau, ngayKetThuc] = [hopDong.date_charged_until, hopDong.Start_date, hopDong.Finish].map(date=>DateReformat.Display(date)); 
    return (
      <div>
        <Typography variant="subtitle1" gutterBottom>
          Ngày bắt đầu hợp đồng: {ngayBatDau}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Ngày kết thúc hợp đồng: {ngayKetThuc}
        </Typography>
        <Typography variant="subtitle1" color={!hopDong.isHDValid? "error" : "initial"} gutterBottom>
          Trả đến khi: {ngayTraDenKhi}
        </Typography>
      </div>
    );
  }
}
