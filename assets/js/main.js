(function () {
  "use strict";

  var CONFIG = window.ZABETHA_CONFIG || {};
  var MAX_FILES = 10;
  var MAX_FILE_SIZE_MB = 10;
  var ACCEPTED_EXTENSIONS = [".pdf", ".doc", ".docx", ".xls", ".xlsx", ".zip", ".jpg", ".jpeg", ".png"];

  document.addEventListener("DOMContentLoaded", function () {
    setFooterYear();
    initNavToggle();
    initTenderForm();
  });

  function setFooterYear() {
    var el = document.querySelector("[data-year]");
    if (el) el.textContent = new Date().getFullYear();
  }

  function initNavToggle() {
    var nav = document.querySelector(".nav");
    var toggle = document.querySelector(".nav__toggle");
    if (!nav || !toggle) return;
    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }

  var PLACEHOLDER_EMAIL = "your-email@example.com";

  function initTenderForm() {
    var form = document.getElementById("tender-form");
    if (!form) return;

    var contactEmail = CONFIG.contactEmail;
    var isConfigured = contactEmail && contactEmail !== PLACEHOLDER_EMAIL;
    var setupBanner = document.getElementById("setup-banner");
    var submitBtn = form.querySelector('button[type="submit"]');

    if (!isConfigured) {
      if (setupBanner) setupBanner.style.display = "block";
    } else {
      form.action = "https://formsubmit.co/ajax/" + encodeURIComponent(contactEmail);
    }

    initFileDrop(form);
    initFieldValidation(form);

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!validateForm(form)) {
        var firstError = form.querySelector(".field--error input, .field--error select, .field--error textarea");
        if (firstError) firstError.focus();
        return;
      }

      if (!isConfigured) {
        showStatus(form, "error", "Form submission isn't wired up yet. See assets/js/config.js for setup instructions, or email your documents to " + (CONFIG.contactEmail || "us") + " in the meantime.");
        return;
      }

      submitForm(form, submitBtn);
    });
  }

  function submitForm(form, submitBtn) {
    var formData = new FormData(form);

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Submitting…";
    }
    showStatus(form, "loading", "Uploading your tender documents — please don't close this page.");

    fetch(form.action, {
      method: "POST",
      body: formData,
      headers: { Accept: "application/json" },
    })
      .then(function (response) {
        if (response.ok) {
          showStatus(form, "success", "Thank you — your tender submission has been received. A confirmation email is on its way to you.");
          form.reset();
          clearFileList(form);
        } else {
          return response.json().then(function (data) {
            var message = (data && (data.message || (data.errors && data.errors.map(function (e) { return e.message; }).join(", ")))) || "Something went wrong submitting your documents. Please try again.";
            showStatus(form, "error", message);
          }).catch(function () {
            showStatus(form, "error", "Something went wrong submitting your documents. Please try again.");
          });
        }
      })
      .catch(function () {
        showStatus(form, "error", "We couldn't reach the submission service. Check your connection and try again.");
      })
      .finally(function () {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = "Submit Tender Documents";
        }
      });
  }

  function showStatus(form, type, message) {
    var status = form.querySelector(".form-status");
    if (!status) return;
    status.className = "form-status is-visible form-status--" + type;
    status.textContent = message;
    status.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function initFieldValidation(form) {
    var fields = form.querySelectorAll("input[required], select[required], textarea[required]");
    fields.forEach(function (field) {
      field.addEventListener("blur", function () {
        validateField(field);
      });
    });
  }

  function validateForm(form) {
    var fields = form.querySelectorAll("input[required], select[required], textarea[required]");
    var valid = true;
    fields.forEach(function (field) {
      if (!validateField(field)) valid = false;
    });
    return valid;
  }

  function validateField(field) {
    var wrapper = field.closest(".field");
    if (!wrapper) return true;
    var isValid = field.checkValidity();
    wrapper.classList.toggle("field--error", !isValid);
    return isValid;
  }

  function initFileDrop(form) {
    var dropZone = form.querySelector(".file-drop");
    var input = form.querySelector('input[type="file"]');
    var list = form.querySelector(".file-list");
    if (!dropZone || !input || !list) return;

    var store = new DataTransfer();

    dropZone.addEventListener("click", function () {
      input.click();
    });

    dropZone.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        input.click();
      }
    });

    ["dragenter", "dragover"].forEach(function (evt) {
      dropZone.addEventListener(evt, function (e) {
        e.preventDefault();
        dropZone.classList.add("is-dragover");
      });
    });

    ["dragleave", "drop"].forEach(function (evt) {
      dropZone.addEventListener(evt, function (e) {
        e.preventDefault();
        dropZone.classList.remove("is-dragover");
      });
    });

    dropZone.addEventListener("drop", function (e) {
      addFiles(e.dataTransfer.files);
    });

    input.addEventListener("change", function () {
      addFiles(input.files);
    });

    function addFiles(fileList) {
      var errors = [];
      Array.prototype.forEach.call(fileList, function (file) {
        if (store.items.length >= MAX_FILES) {
          errors.push("Maximum of " + MAX_FILES + " files reached.");
          return;
        }
        var ext = "." + file.name.split(".").pop().toLowerCase();
        if (ACCEPTED_EXTENSIONS.indexOf(ext) === -1) {
          errors.push(file.name + " has an unsupported file type.");
          return;
        }
        if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
          errors.push(file.name + " exceeds " + MAX_FILE_SIZE_MB + "MB.");
          return;
        }
        store.items.add(file);
      });

      input.files = store.files;
      renderFileList();

      if (errors.length) {
        var status = form.querySelector(".form-status");
        if (status) showStatus(form, "error", errors.join(" "));
      }
    }

    function renderFileList() {
      list.innerHTML = "";
      Array.prototype.forEach.call(store.files, function (file, index) {
        var li = document.createElement("li");
        var sizeKb = (file.size / 1024).toFixed(0);
        li.innerHTML =
          '<span>' + escapeHtml(file.name) + " (" + sizeKb + " KB)</span>" +
          '<button type="button" data-index="' + index + '">Remove</button>';
        list.appendChild(li);
      });

      list.querySelectorAll("button").forEach(function (btn) {
        btn.addEventListener("click", function () {
          var idx = parseInt(btn.getAttribute("data-index"), 10);
          removeFile(idx);
        });
      });
    }

    function removeFile(index) {
      var next = new DataTransfer();
      Array.prototype.forEach.call(store.files, function (file, i) {
        if (i !== index) next.items.add(file);
      });
      store = next;
      input.files = store.files;
      renderFileList();
    }

    form._clearFileList = function () {
      store = new DataTransfer();
      input.files = store.files;
      renderFileList();
    };
  }

  function clearFileList(form) {
    if (typeof form._clearFileList === "function") form._clearFileList();
  }

  function escapeHtml(str) {
    var div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }
})();
