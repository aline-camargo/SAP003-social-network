const textArea = (props) => {
  const template = `
      <textarea
        class="${props.class}"
        placeholder="${props.placeholder}"
        onkeyup="textarea.handleKeyup(event,${props.onKeyup})"
      ></textarea>`;

  return template;
};

window.textarea = {
  handleKeyup: (e, callBack) => {
    callBack(e);
  },
};

export default textArea;
