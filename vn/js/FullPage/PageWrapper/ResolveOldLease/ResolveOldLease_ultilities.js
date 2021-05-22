class ResolveOldLease_ultilities extends PageWrapperChildrenComponent {
  render() {
    const {
      Table,
      Paper,
      TableContainer,
      TableHead,
      TableRow,
      TableBody,
      TableCell,
      TableFooter,
      Typography,
    } = MaterialUI;

    const { chiTietHD, endDate } = this.props;
    const tienIch = { ...chiTietHD };

    let chiTietTienIch = Object.values(tienIch).flatMap((item) =>
      Object.values(item)
    );

    const handleSoftDate = () => chiTietTienIch.filter(({ date }) => moment(date).isBefore(moment(endDate)));

    const renderChiTietTienIch = () => {
      return handleSoftDate().map((item, index) => {
        return (
          <TableRow key={index}>
            <TableCell align="left">{item.revenue_type}</TableCell>
            <TableCell align="right">
              {moment(item.previous_date).format("DD-MM-YYYY")}
            </TableCell>
            <TableCell align="right">
              {moment(item.date).format("DD-MM-YYYY")}
            </TableCell>
            <TableCell align="right">{item.price}</TableCell>
            <TableCell align="right">{item.quantity}</TableCell>
            <TableCell align="right">
              {(item.quantity * item.price).toLocaleString()}
            </TableCell>
          </TableRow>
        );
      });
    };

    const handleTinhTong = ()=>{
      return handleSoftDate().reduce((tongTien, item)=>{
        return (tongTien += item.quantity * item.price);
      }, 0);
    }

    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Phí sinh hoạt</TableCell>
              <TableCell align="right">Ngày bắt đầu</TableCell>
              <TableCell align="right">Ngày kết thúc</TableCell>
              <TableCell align="right">Đơn giá</TableCell>
              <TableCell align="right">Số lượng</TableCell>
              <TableCell align="right">Thành tiền</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
              {renderChiTietTienIch()}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell align="right" colSpan={6}>
                <Typography variant="subtitle2" gutterBottom>
                  Tổng thành tiền:{" "}
                  {handleTinhTong().toLocaleString()}
                </Typography>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    );
  }
}
