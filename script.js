// Clean Campus, Green Campus – Campus Ambassador Registration
// Vanilla JavaScript: validation, image preview, success message.

const form = document.getElementById('registration-form');
const formWrapper = document.getElementById('form-wrapper');
const successMessage = document.getElementById('success-message');
const registerAgainBtn = document.getElementById('register-again');

const nameInput = document.getElementById('studentName');
const idInput = document.getElementById('studentId');
const classSelect = document.getElementById('studentClass');
const schoolInput = document.getElementById('schoolName');
const photoInput = document.getElementById('studentPhoto');

const uploadArea = document.getElementById('upload-area');
const previewArea = document.getElementById('preview-area');
const previewImage = document.getElementById('preview-image');
const fileNameText = document.getElementById('file-name');
const removePhotoBtn = document.getElementById('remove-photo');

const ALLOWED_TYPES = ['image/jpeg', 'image/png'];
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png'];

// ---------- Error helpers ----------
function showError(input, message) {
  const errorEl = document.getElementById(input.id + '-error');
  errorEl.textContent = message;
  errorEl.hidden = false;
  input.setAttribute('aria-invalid', 'true');
  if (input === photoInput) uploadArea.classList.add('has-error');
}

function clearError(input) {
  const errorEl = document.getElementById(input.id + '-error');
  errorEl.textContent = '';
  errorEl.hidden = true;
  input.removeAttribute('aria-invalid');
  if (input === photoInput) uploadArea.classList.remove('has-error');
}

// ---------- Field validators (return true when valid) ----------
function validateText(input, message) {
  if (input.value.trim() === '') {
    showError(input, message);
    return false;
  }
  clearError(input);
  return true;
}

function validateName()   { return validateText(nameInput, 'শিক্ষার্থীর নাম লিখুন।'); }
function validateId()     { return validateText(idInput, 'শিক্ষার্থী আইডি লিখুন।'); }
function validateSchool() { return validateText(schoolInput, 'বিদ্যালয়ের নাম লিখুন।'); }

function validateClass() {
  if (classSelect.value === '') {
    showError(classSelect, 'শ্রেণি নির্বাচন করুন।');
    return false;
  }
  clearError(classSelect);
  return true;
}

function validatePhoto() {
  if (!photoInput.files || photoInput.files.length === 0) {
    showError(photoInput, 'শিক্ষার্থীর ছবি আপলোড করুন।');
    return false;
  }
  clearError(photoInput);
  return true;
}

// ---------- Image preview ----------
function isAllowedImage(file) {
  const extension = file.name.split('.').pop().toLowerCase();
  return ALLOWED_TYPES.includes(file.type) && ALLOWED_EXTENSIONS.includes(extension);
}

function showPreview(file) {
  const reader = new FileReader();
  reader.onload = function (e) {
    previewImage.src = e.target.result;
    fileNameText.textContent = file.name;
    uploadArea.hidden = true;
    previewArea.hidden = false;
  };
  reader.readAsDataURL(file);
}

function resetPhoto() {
  photoInput.value = '';
  previewImage.removeAttribute('src');
  fileNameText.textContent = '';
  previewArea.hidden = true;
  uploadArea.hidden = false;
}

photoInput.addEventListener('change', function () {
  const file = photoInput.files[0];

  // User cancelled the file dialog
  if (!file) {
    if (previewImage.getAttribute('src')) return; // keep the existing image
    validatePhoto();
    return;
  }

  if (!isAllowedImage(file)) {
    resetPhoto();
    showError(photoInput, 'শুধু JPG, JPEG অথবা PNG ছবি নির্বাচন করুন।');
    return;
  }

  clearError(photoInput);
  showPreview(file);
});

removePhotoBtn.addEventListener('click', function () {
  resetPhoto();
  validatePhoto();
  photoInput.focus();
});

// ---------- Clear errors as the user fixes fields ----------
nameInput.addEventListener('input', function () { if (nameInput.value.trim()) clearError(nameInput); });
idInput.addEventListener('input', function () { if (idInput.value.trim()) clearError(idInput); });
schoolInput.addEventListener('input', function () { if (schoolInput.value.trim()) clearError(schoolInput); });
classSelect.addEventListener('change', validateClass);

// ---------- Submit ----------
form.addEventListener('submit', function (event) {
  event.preventDefault();

  // Run every check so all errors show at once
  const results = [
    { input: nameInput,    valid: validateName() },
    { input: idInput,      valid: validateId() },
    { input: classSelect,  valid: validateClass() },
    { input: schoolInput,  valid: validateSchool() },
    { input: photoInput,   valid: validatePhoto() }
  ];

  const firstInvalid = results.find(function (r) { return !r.valid; });
  if (firstInvalid) {
    // The file input is visually hidden, so focus it directly (it shows the focus ring on the upload area)
    firstInvalid.input.focus();
    return;
  }

  // Frontend-only assignment: nothing is sent to a server or saved.
  formWrapper.hidden = true;
  successMessage.hidden = false;
  successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

// ---------- Register again ----------
registerAgainBtn.addEventListener('click', function () {
  form.reset();
  resetPhoto();
  [nameInput, idInput, classSelect, schoolInput, photoInput].forEach(clearError);
  successMessage.hidden = true;
  formWrapper.hidden = false;
  nameInput.focus();
});
