// File: /public/viewer.js
window.addEventListener('DOMContentLoaded', () => {
  const modelAsset = document.querySelector('#modelGLB');
  const markerParam = new URLSearchParams(window.location.search).get('marker');

  if (!markerParam) {
    alert('Marker ID not provided.');
    return;
  }

  // Extract targetIndex from marker ID (e.g., floorplan-001 -> 1)
  const targetIndex = parseInt(markerParam.split('-')[1]);
  const backendURL = `/api/models/by-target/${targetIndex}`;

  fetch(backendURL)
    .then(response => {
      if (!response.ok) throw new Error('Model load failed.');
      return response.json();
    })
    .then(data => {
      modelAsset.setAttribute('src', data.modelUrl);
      document.querySelector('[mindar-image-target]').setAttribute('mindar-image-target', `targetIndex: ${data.targetIndex}`);
      document.getElementById('loading').style.display = 'none';
    })
    .catch(err => {
      console.error('AR model load error:', err);
      alert('Unable to load 3D model. Please try again later.');
    })

});
