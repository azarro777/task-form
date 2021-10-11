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
    console.log(element.value);
    var inputVal = element.value;
    var fieldValidation = validations[element.id];
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
  // var currentTab = 0; // Current tab is set to be the first tab (0)
  // showTab(currentTab); // Display the current tab

  document.querySelector('.control_next').onclick = function () {
    nextPrev(1);
  };
  document.querySelector('.control_prev').onclick = function () {
    nextPrev(-1);
  };

  function nextPrev(n) {
    console.log('step', n);
    var input = document.getElementsByClassName('field');
    var step = document.getElementsByClassName('step');
    var buttons = document.getElementsByClassName('control');

    var isValidInputs = [];

    for (var i = 0, length = 6; i < length; i++) {
      toggleError(input[i], validateField(input[i]).message);
      isValidInputs.push(validateField(input[i]).valid);
    }
    console.log(isValidInputs.includes(false));
    // This function will figure out which tab to display
    if (n === -1) {
      console.log('step prev', n);
      step[1].className = step[1].className.replace('step_active', '');
      step[1].style.display = 'none';
      step[0].className += ' step_active';
      step[0].style.display = 'block';
      buttons[1].className = buttons[1].className.replace('control_hide', '');
      buttons[0].className += ' control_hide';
      buttons[2].className += ' control_hide';
    }
    // Exit the function if any field in the current tab is invalid:
    if (n === 1 && isValidInputs.includes(false)) return false;
    // Hide the current tab:
    if (n === 1) {
      console.log('step next', n);
      step[0].className = step[0].className.replace('step_active', '');
      step[0].style.display = 'none';
      step[1].style.display = 'block';
      step[1].className += ' step_active';
      buttons[0].className = buttons[0].className.replace('control_hide', '');
      buttons[1].className += ' control_hide';
      buttons[2].className = buttons[2].className.replace('control_hide', '');

      buttons[2].addEventListener('click', function (event) {
        toggleError(input[6], validateField(input[6]).message);
        if (!validateField(input[6]).valid) {
          event.preventDefault();
        }
      });
    }
  }

  var zip = document.getElementById('zip');
  /*
   * Listeners
   * */

  var state = document.getElementById('state');
  var city = document.getElementById('city')


  function callPHP(url, data) {
    var xml = new XMLHttpRequest();
    xml.open('POST', url, true);
    xml.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    // var resp = JSON.parse(xml.responseText);
    // console.log('RESPONSE', resp);
    xml.onreadystatechange = function () {
      if (xml.readyState !== 4 || xml.status !== 200) {
        return;
      }
      xml.responseText;
      console.log(xml.responseText);
      var res = JSON.parse(xml.responseText);
      console.log(res);
      state.disabled = false;
      state.value = res.state;
      city.disabled = false;
      city.value = res.city;

    }
    xml.send(data);

  }

  document.getElementById('mainForm').addEventListener('change', formOnchange);
  zip.addEventListener('change', function () {
    if (validateField(zip).valid) {

      var zipCode = 'zip=' + encodeURIComponent(zip.value);
      console.log('zipCode', zipCode)

      var xhr = new XMLHttpRequest();
      xhr.open('POST', 'api/geoStatus.php', true);
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xhr.onreadystatechange = function () {
        if (xhr.readyState !== 4 || xhr.status !== 200) {
          return;
        }
        if (xhr.responseText === 'allowed'){
          callPHP('api/geoData.php', zipCode);
        } else if (xhr.responseText === 'blocked') {
          state.disabled = true;
          state.value = '';
          city.disabled = true;
          city.value = '';
          alert('Zip is blocked!');
        } else {
          alert('error');
        }

        console.log(xhr.responseText);
      };
      xhr.send(zipCode);
    } else {
      state.disabled = true;
      state.value = '';
      city.disabled = true;
      city.value = '';

    }
  });
})();
