class UtilityReading extends PageWrapperChildrenComponent {
  render() {
    const { Box, Typography, FormControl } = MaterialUI;
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          Tiện Ích
        </Typography>
        <Typography variant="h6" gutterBottom>
          Thêm mới tiện ích
        </Typography>
        <FormControl variant="outlined" fullWidth={true} size="small" margin="normal">
          <UtilityReadingListChoice/>
        </FormControl>
        <UtilityReadingTable />
        <SubmitButton type="button" />
      </Box>
    );
  }
}
