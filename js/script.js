(function () {
  /*
   * Secondary functions
   * */
  function ajax(params) {
    var xhr = new XMLHttpRequest();
    var url = params.url || '';
    var body = params.body || '';
    var success = params.success;
    var error = params.error;

    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(body);
    xhr.onload = function () {
      if (
        xhr.readyState === 4 &&
        xhr.status === 200 &&
        typeof success === 'function'
      ) {
        success(xhr.response);
      } else if (
        xhr.readyState === 4 &&
        xhr.status !== 200 &&
        typeof error === 'function'
      ) {
        error(xhr.response);
      }
    };
    xhr.onerror = error || null;
  }

  /*
   * Validation
   * */
  function checkRegExp(pattern, message, value) {
    return pattern.test(value) ? true : message;
  }

  //? compare two passwords
  const pass = document.getElementById('password');

  function compare(pattern, message, value) {
    return pattern.value === value ? true : message;
  }

  var validations = {
    firstName: [
      checkRegExp.bind(
        null,
        /^[A-Zа-я]{2,}$/i,
        'Field may contain only letters and not be less than 2 letters'
      ),
      checkRegExp.bind(
        null,
        /^[A-Zа-я]{2,64}$/i,
        'Field may contain only letters and not be more than 64 letters'
      )
    ],
    lastName: [
      checkRegExp.bind(
        null,
        /^[A-Zа-я]{2,}$/i,
        'Field may contain only letters and not be less than 2 letters'
      ),
      checkRegExp.bind(
        null,
        /^[A-Zа-я]{2,64}$/i,
        'Field may contain only letters and not be more than 64 letters'
      )
    ],
    email: [
      checkRegExp.bind(
        null,
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please enter valid email'
      )
    ],
    phone: [
      checkRegExp.bind(null, /^[0-9]{8}$/, 'Field may contain only 8 digits')
    ],
    password: [
      checkRegExp.bind(
        null,
        /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[\!\@\#\$\%\^\&\*\-])/,
        'Required at least one number (0-9), uppercase and lowercase letters (a-Z) and at least one special character (!@#$%^&*-)'
      )
    ],
    password2: [compare.bind(null, pass, 'Must be to equal to password')],

    zip: [
      checkRegExp.bind(
        null,
        /^[0-9]{5}$/,
        'Field must include 5 digits and only consist of numeric values'
      )
    ]
  };

  function validateField(element) {
    var fieldValidation = validations[element.id];
    console.log(fieldValidation, 'validation');
    var result = { valid: true, element: element, message: '' };

    if (fieldValidation) {
      for (var i = 0, len = fieldValidation.length; i < len; i++) {
        var validationFunction = fieldValidation[i];
        var answer = validationFunction(element.value);
        if (typeof answer === 'string') {
          result.valid = false;
          result.message = answer;
          break;
        }
      }
    }
    return result;
  }

  /*
   * Other function
   * */
  function toggleError(element, message) {
    console.log(element, message);
    var errorMessageElement =
      element.nextElementSibling &&
      element.nextElementSibling.classList.contains('field-error')
        ? element.nextElementSibling
        : null;
    console.log(errorMessageElement);
    errorMessageElement && message && (errorMessageElement.innerHTML = message);
    errorMessageElement && !message && (errorMessageElement.innerHTML = '');
  }
  function formOnchange(e) {
    console.log(e, 'e');
    if (e.target.dataset && e.target.dataset.validation !== undefined) {
      toggleError(e.target, validateField(e.target).message);
    }
  }

  //? toggle buttons
  var currentTab = 0; // Current tab is set to be the first tab (0)
  showTab(currentTab); // Display the current tab

  document.querySelector('.control_next').onclick = function () {
    nextPrev(1);
  };
  document.querySelector('.control_prev').onclick = function () {
    nextPrev(-1);
  };

  function showTab(n) {
    console.log('showTab', n);
    // This function will display the specified tab of the form ...
    var x = document.getElementsByClassName('step');
    x[n].style.display = 'block';
    // ... and fix the Previous/Next buttons:
    if (n == 1) {
      // document.getElementById('prevBtn').style.display = 'none';
    } else {
      // document.getElementById('prevBtn').style.display = 'inline';
    }
    if (n == x.length - 1) {
      // document.getElementById('nextBtn').innerHTML = 'Submit';
    } else {
      // document.getElementById('nextBtn').innerHTML = 'Next';
    }
    // ... and run a function that displays the correct step indicator:
    // fixStepIndicator(n);
  }

  function nextPrev(n) {
    console.log(n);
    var input = document.getElementsByClassName('field');
    var x = document.getElementsByClassName('step');
    var buttons = document.getElementsByClassName('control');
    var isValidInputs = [];

    for (var i = 0, length = 6; i < length; i++) {
      toggleError(input[i], validateField(input[i]).message);
      isValidInputs.push(validateField(input[i]).valid);
    }
    console.log(isValidInputs.includes(false));
    // This function will figure out which tab to display

    // Exit the function if any field in the current tab is invalid:
    if (n == 1 && isValidInputs.includes(false)) return false;
    // Hide the current tab:

    console.log(x, 'x');
    x[n - 1].className = x[n - 1].className.replace('step_active', '');
    x[n - 1].style.display = 'none';
    x[n].className += ' step_active';
    buttons[n - 1].className = buttons[n - 1].className.replace(
      'control_hide',
      ''
    );
    buttons[n].className += ' control_hide';
    buttons[n + 1].className = buttons[n + 1].className.replace(
      'control_hide',
      ''
    );
    // Increase or decrease the current tab by 1:
    currentTab = currentTab + n;
    // if you have reached the end of the form... :
    if (currentTab >= x.length) {
      //...the form gets submitted:
      document.getElementById('regForm').submit();
      return false;
    }
    // Otherwise, display the correct tab:
    showTab(currentTab);
  }

  /*
   * Listeners
   * */
  document.getElementById('mainForm').addEventListener('change', formOnchange);
})();
