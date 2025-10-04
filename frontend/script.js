confirmBtn.addEventListener('click', () => {
  if (videoPreview.src && !videoPreview.hidden) {
    const formData = new FormData();
    formData.append('video', input.files[0]);

    confirmationMsg.textContent = 'Uploading and analyzing...';

    fetch('http://localhost:5000/upload', {
      method: 'POST',
      body: formData
    })
    .then(res => res.json())
    .then(data => {
      confirmationMsg.textContent = '✅ Analysis complete!';
      console.log('Frame reports:', data.frames);
      console.log('Holistic summary:', data.summary);

      // You can now render this data in the DOM
      alert("Game Summary:\n\n" + data.summary);
    })
    .catch(err => {
      confirmationMsg.style.color = '#f00';
      confirmationMsg.textContent = 'Error during upload or analysis.';
      console.error(err);
    });
  } else {
    confirmationMsg.style.color = '#f00';
    confirmationMsg.textContent = 'No video input';
  }
});