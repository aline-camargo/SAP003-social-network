const selectPrivacy = (props) => {
  const template = `
      <select class="${props.class}" onchange="select.handleClick(event,${props.onChange})">
        <option class="${props.opClass1}" value="${props.value1}" selected>${props.txt1}</option>
        <option class="${props.opClass2}" value="${props.value2}">${props.txt2}</option>
      </select>
      `;
  return template;
};

window.select = {
  handleClick: (e, callBack) => {
    callBack(e);
  },
};

export default selectPrivacy;

