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
    } = MaterialUI;

    const {chiTietHD} = this.props;
    const tienIch = {...chiTietHD};
    // const dsTienIch = Object.values(tienIch);
    // const chiTietTienIch = Object.values(dsTienIch[0]);
    const chiTietTienIch = Object.values(tienIch).reduce((item, index)=>{
      return [...item] = Object.values(index);
    },[]);
    console.log(chiTietTienIch);
    
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
            {chiTietTienIch.map((tienIch, index)=>{
              return <TableRow key={index}>
                <TableCell align="left">{tienIch.revenue_type}</TableCell>
                <TableCell align="right">{tienIch.previous_date}</TableCell>
                <TableCell align="right">{tienIch.date}</TableCell>
                <TableCell align="right">{(tienIch.price).toLocaleString()}</TableCell>
                <TableCell align="right">{(tienIch.quantity).toLocaleString()}</TableCell>
                <TableCell align="right">{(tienIch.quantity * tienIch.price).toLocaleString()}</TableCell>
              </TableRow>
            })}
          </TableBody>
          <TableFooter>
              <TableRow>
                <TableCell align="center">Tổng thành tiền: {
                  (chiTietTienIch.reduce((tongTien, item)=>{
                    return tongTien += item.quantity * item.price
                  },0)).toLocaleString()
                }</TableCell>
              </TableRow>
         </TableFooter>
        </Table>
      </TableContainer>
    );
  }
}
