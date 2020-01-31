const fileInput = props => `
    <label for="input-file" class="file-input-label">
        ${props.title}
        <input
            type="file" id="input-file"
            data-uid="${props.uid}"
            onChange="fileInputClick.handleClick(event, ${props.onChange})"
        />
    </label>`;

window.fileInputClick = {
  handleClick: (e, callback) => {
    callback(e.currentTarget, e.currentTarget.dataset.uid);
  },
};

export default fileInput;
