class UtilityReadingListChoice extends PageWrapperChildrenComponent {
  render() {
    const { Select, MenuItem } = MaterialUI;

    return (
      <Select defaultValue="" native={false}>
        <MenuItem value={10}>Ten</MenuItem>
        <MenuItem value={20}>Twenty</MenuItem>
        <MenuItem value={30}>Thirty</MenuItem>
      </Select>
    );
  }
}
