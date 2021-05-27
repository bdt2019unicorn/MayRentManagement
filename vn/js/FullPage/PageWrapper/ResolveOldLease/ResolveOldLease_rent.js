class ResolveOldLease_rent extends PageWrapperChildrenComponent {
  render() {
    const {
      Table,
      Paper,
      TableContainer,
      TableHead,
      TableRow,
      TableBody,
      TableCell,
      withStyles,
    } = MaterialUI;

    const { hopDong, rentInvoice } = this.props;

    // const tinhSoLuong = ()=>{
    //   return rentInvoice.RentQuantityCalculation(hopDong.Start_date, hopDong.date_charged_until, hopDong.leaseagrm_period);
    // }

    const tinhSoLuong = rentInvoice.RentQuantityCalculation(hopDong.Start_date, hopDong.date_charged_until, hopDong.leaseagrm_period);
    const thanhTien = tinhSoLuong * hopDong.Rent_amount; 


    

    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ngày bắt đầu hợp đồng</TableCell>
              <TableCell align="right">Trả đến khi</TableCell>
              <TableCell align="right">Kỳ hạn hợp đồng</TableCell>
              <TableCell align="right">Số tiền thuê</TableCell>
              <TableCell align="right">Số lượng</TableCell>
              <TableCell align="right">Tổng tiền thanh toán</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell align="left">{moment(hopDong.Start_date).format("DD-MM-YYYY")}</TableCell>
              <TableCell style={hopDong.isHDValid ? {backgroundColor: ""}:{backgroundColor: "red"}} align="right">{moment(hopDong.date_charged_until).format("DD-MM-YYYY")}</TableCell>
              <TableCell align="right">{hopDong.leaseagrm_period}</TableCell>
              <TableCell align="right">{hopDong.Rent_amount}</TableCell>
              <TableCell align="right">{tinhSoLuong}</TableCell>
              <TableCell align="right">{thanhTien.toFixed(3)}</TableCell>
            </TableRow>
          </TableBody>
          
        </Table>
      </TableContainer>
    );
  }
}
