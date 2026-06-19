// Camp Lawton Staff Application Client Logic
document.addEventListener('DOMContentLoaded', () => {
  // Navigation elements
  const btnBack = document.getElementById('btnBack');
  const btnNext = document.getElementById('btnNext');
  const wizardFooter = document.getElementById('wizardFooter');
  const successScreen = document.getElementById('successScreen');
  const btnApplyAgain = document.getElementById('btnApplyAgain');
  const stepNodes = document.querySelectorAll('.step-node');
  const formSteps = document.querySelectorAll('.form-step');
  const stepperProgress = document.getElementById('stepperProgress');
  const staffAppForm = document.getElementById('staffAppForm');

  // Signature elements
  const sigPad = document.getElementById('sigPad');
  const sigClearBtn = document.getElementById('sigClearBtn');
  let sigCtx = null;
  let isSigDrawing = false;
  let isSigDrawn = false;

  // State
  let currentStep = 1;
  const totalSteps = 5;
  const DRAFT_KEY = 'camp_lawton_staff_draft';

  // 1. EMBERS BACKGROUND PARTICLE SYSTEM (Reused from dashboard for visual parity)
  const emberCanvas = document.getElementById('emberCanvas');
  let canvasCtx = null;
  let particles = [];
  const maxParticles = 30;

  function initEmberCanvas() {
    canvasCtx = emberCanvas.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    for (let i = 0; i < maxParticles; i++) {
      particles.push(createParticle(true));
    }
    requestAnimationFrame(animateParticles);
  }

  function resizeCanvas() {
    emberCanvas.width = window.innerWidth;
    emberCanvas.height = window.innerHeight;
  }

  function createParticle(randomY = false) {
    const w = emberCanvas.width;
    const h = emberCanvas.height;
    return {
      x: Math.random() * w,
      y: randomY ? Math.random() * h : h + 20,
      size: Math.random() * 2.5 + 0.5,
      speedX: (Math.random() - 0.5) * 0.8,
      speedY: -(Math.random() * 1.0 + 0.4),
      color: getRandomEmberColor(),
      alpha: Math.random() * 0.5 + 0.3,
      fadeRate: Math.random() * 0.003 + 0.001
    };
  }

  function getRandomEmberColor() {
    const colors = [
      'rgba(255, 122, 0, ',  // Amber Orange
      'rgba(255, 76, 0, ',   // Campfire Red-Orange
      'rgba(255, 183, 0, ',  // Lantern Yellow
      'rgba(238, 82, 83, '   // Crimson
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  function animateParticles() {
    if (!canvasCtx) return;
    canvasCtx.clearRect(0, 0, emberCanvas.width, emberCanvas.height);
    for (let i = 0; i < particles.length; i++) {
      let p = particles[i];
      p.x += p.speedX;
      p.y += p.speedY;
      p.alpha -= p.fadeRate;

      canvasCtx.beginPath();
      canvasCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      canvasCtx.fillStyle = p.color + p.alpha + ')';
      canvasCtx.shadowBlur = p.size * 3;
      canvasCtx.shadowColor = 'rgba(255, 122, 0, 0.4)';
      canvasCtx.fill();

      if (p.alpha <= 0 || p.y < -10 || p.x < -10 || p.x > emberCanvas.width + 10) {
        particles[i] = createParticle(false);
      }
    }
    requestAnimationFrame(animateParticles);
  }

  // 2. SIGNATURE PAD DRAWING LOGIC
  function initSignaturePad() {
    sigCtx = sigPad.getContext('2d');
    
    // Set internal resolution matching display size
    const resizePad = () => {
      const rect = sigPad.parentElement.getBoundingClientRect();
      sigPad.width = rect.width;
      sigPad.height = rect.height;
      
      // Setup drawing context style
      sigCtx.strokeStyle = '#ffb74d'; // Warm ember gold line
      sigCtx.lineWidth = 3;
      sigCtx.lineCap = 'round';
      sigCtx.lineJoin = 'round';
      isSigDrawn = false; // Reset status on resize since canvas clears
    };

    resizePad();
    window.addEventListener('resize', resizePad);

    // Event listeners for drawing
    const getPos = (e) => {
      const rect = sigPad.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    };

    const startDraw = (e) => {
      isSigDrawing = true;
      const pos = getPos(e);
      sigCtx.beginPath();
      sigCtx.moveTo(pos.x, pos.y);
      e.preventDefault();
    };

    const draw = (e) => {
      if (!isSigDrawing) return;
      const pos = getPos(e);
      sigCtx.lineTo(pos.x, pos.y);
      sigCtx.stroke();
      isSigDrawn = true;
      e.preventDefault();
    };

    const stopDraw = () => {
      isSigDrawing = false;
    };

    // Pointer support
    sigPad.addEventListener('mousedown', startDraw);
    sigPad.addEventListener('mousemove', draw);
    sigPad.addEventListener('mouseup', stopDraw);
    sigPad.addEventListener('mouseleave', stopDraw);

    // Touch support
    sigPad.addEventListener('touchstart', startDraw);
    sigPad.addEventListener('touchmove', draw);
    sigPad.addEventListener('touchend', stopDraw);

    // Clear Pad Button
    sigClearBtn.addEventListener('click', () => {
      sigCtx.clearRect(0, 0, sigPad.width, sigPad.height);
      isSigDrawn = false;
    });
  }

  // 3. WIZARD STEP NAVIGATION
  function updateStepUI() {
    // Scroll to top of card so user doesn't stay scrolled down
    document.querySelector('.wizard-card').scrollIntoView({ behavior: 'smooth' });

    // Update Step nodes classes
    stepNodes.forEach(node => {
      const stepNum = parseInt(node.getAttribute('data-step'));
      node.classList.remove('active', 'completed');
      if (stepNum === currentStep) {
        node.classList.add('active');
      } else if (stepNum < currentStep) {
        node.classList.add('completed');
      }
    });

    // Update progress bar
    const progressPercent = ((currentStep - 1) / (totalSteps - 1)) * 100;
    stepperProgress.style.width = `${progressPercent}%`;

    // Toggle Form Step Containers
    formSteps.forEach(step => {
      step.classList.remove('active');
      if (step.id === `step${currentStep}`) {
        step.classList.add('active');
      }
    });

    // Update buttons
    btnBack.disabled = (currentStep === 1);
    
    if (currentStep === totalSteps) {
      btnNext.innerHTML = 'Submit Application ⚜️';
      btnNext.classList.add('highlight-border-orange');
      // Populate the step 5 summary screen
      populateSummary();
      // Wait briefly then resize signature canvas to avoid initial sizing bugs
      setTimeout(() => {
        const rect = sigPad.parentElement.getBoundingClientRect();
        if (sigPad.width !== rect.width) {
          sigPad.width = rect.width;
          sigPad.height = rect.height;
          sigCtx.strokeStyle = '#ffb74d';
          sigCtx.lineWidth = 3;
          sigCtx.lineCap = 'round';
          sigCtx.lineJoin = 'round';
        }
      }, 100);
    } else {
      btnNext.innerHTML = 'Next Step ▶';
      btnNext.classList.remove('highlight-border-orange');
    }
  }

  // 4. CONDITIONAL FIELDS VISIBILITY LOGIC
  const setupConditionals = () => {
    // Under 18 elements
    const ageRadios = document.getElementsByName('ageGroup');
    const guardianSec = document.getElementById('guardianSection');
    const guardianSigSec = document.getElementById('guardianSignatureSection');

    const updateMinorFields = () => {
      let isMinor = false;
      for (const radio of ageRadios) {
        if (radio.checked && (radio.value === '14' || radio.value === '16')) {
          isMinor = true;
          break;
        }
      }
      if (isMinor) {
        guardianSec.classList.remove('hidden');
        guardianSigSec.classList.remove('hidden');
      } else {
        guardianSec.classList.add('hidden');
        guardianSigSec.classList.add('hidden');
      }
    };

    ageRadios.forEach(radio => radio.addEventListener('change', updateMinorFields));

    // Scouting details
    const scoutingRadios = document.getElementsByName('scoutingStatus');
    const scoutingDetails = document.getElementById('scoutingDetails');
    const updateScoutingFields = () => {
      let registered = false;
      for (const r of scoutingRadios) {
        if (r.checked && r.value === 'Registered') {
          registered = true;
        }
      }
      if (registered) {
        scoutingDetails.classList.remove('hidden');
      } else {
        scoutingDetails.classList.add('hidden');
      }
    };
    scoutingRadios.forEach(radio => radio.addEventListener('change', updateScoutingFields));

    // NCS details
    const ncsRadios = document.getElementsByName('ncsHolder');
    const ncsDetails = document.getElementById('ncsDetails');
    const updateNcsFields = () => {
      let hasNcs = false;
      for (const r of ncsRadios) {
        if (r.checked && r.value === 'Yes') {
          hasNcs = true;
        }
      }
      if (hasNcs) {
        ncsDetails.classList.remove('hidden');
      } else {
        ncsDetails.classList.add('hidden');
      }
    };
    ncsRadios.forEach(radio => radio.addEventListener('change', updateNcsFields));

    // Previous camp staff details
    const prevStaffRadios = document.getElementsByName('prevStaff');
    const prevStaffDetails = document.getElementById('prevStaffDetails');
    const updatePrevStaffFields = () => {
      let hadExp = false;
      for (const r of prevStaffRadios) {
        if (r.checked && r.value === 'Yes') {
          hadExp = true;
        }
      }
      if (hadExp) {
        prevStaffDetails.classList.remove('hidden');
      } else {
        prevStaffDetails.classList.add('hidden');
      }
    };
    prevStaffRadios.forEach(radio => radio.addEventListener('change', updatePrevStaffFields));

    // Education details
    const hsCheck = document.getElementById('eduHighschool');
    const hsDetails = document.getElementById('hsDetails');
    hsCheck.addEventListener('change', () => {
      if (hsCheck.checked) hsDetails.classList.remove('hidden');
      else hsDetails.classList.add('hidden');
    });

    const collegeCheck = document.getElementById('eduCollege');
    const collegeDetails = document.getElementById('collegeDetails');
    collegeCheck.addEventListener('change', () => {
      if (collegeCheck.checked) collegeDetails.classList.remove('hidden');
      else collegeDetails.classList.add('hidden');
    });

    // Life Safety Certifications Exp Dates
    const cprCheck = document.getElementById('certCpr');
    const cprDetails = document.getElementById('cprDetails');
    cprCheck.addEventListener('change', () => {
      if (cprCheck.checked) cprDetails.classList.remove('hidden');
      else cprDetails.classList.add('hidden');
    });

    const wfaCheck = document.getElementById('certWfa');
    const wfaDetails = document.getElementById('wfaDetails');
    wfaCheck.addEventListener('change', () => {
      if (wfaCheck.checked) wfaDetails.classList.remove('hidden');
      else wfaDetails.classList.add('hidden');
    });

    const otherCheck = document.getElementById('certOther');
    const otherDetails = document.getElementById('otherDetails');
    otherCheck.addEventListener('change', () => {
      if (otherCheck.checked) otherDetails.classList.remove('hidden');
      else otherDetails.classList.add('hidden');
    });

    // Hook inputs to save draft on change
    staffAppForm.addEventListener('input', saveDraft);
    staffAppForm.addEventListener('change', saveDraft);
  };

  // 5. VALIDATION PER STEP
  const validateField = (element, idErr, customCheck = () => true) => {
    const errorEl = document.getElementById(idErr);
    if (!element.value || element.value.trim() === '' || !customCheck(element.value)) {
      element.classList.add('invalid');
      if (errorEl) errorEl.classList.remove('hidden');
      return false;
    } else {
      element.classList.remove('invalid');
      if (errorEl) errorEl.classList.add('hidden');
      return true;
    }
  };

  const validateRadio = (name, idErr) => {
    const radios = document.getElementsByName(name);
    const errorEl = document.getElementById(idErr);
    let checked = false;
    for (const r of radios) {
      if (r.checked) {
        checked = true;
        break;
      }
    }
    if (!checked) {
      if (errorEl) errorEl.classList.remove('hidden');
      return false;
    } else {
      if (errorEl) errorEl.classList.add('hidden');
      return true;
    }
  };

  const isEmail = (val) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(val);
  };

  const isUnder18 = () => {
    const radios = document.getElementsByName('ageGroup');
    for (const r of radios) {
      if (r.checked && (r.value === '14' || r.value === '16')) return true;
    }
    return false;
  };

  const validateStep = (step) => {
    let isValid = true;

    if (step === 1) {
      isValid = validateField(document.getElementById('firstName'), 'firstNameErr') && isValid;
      isValid = validateField(document.getElementById('lastName'), 'lastNameErr') && isValid;
      isValid = validateField(document.getElementById('phone'), 'phoneErr') && isValid;
      isValid = validateField(document.getElementById('email'), 'emailErr', isEmail) && isValid;
      isValid = validateField(document.getElementById('address'), 'addressErr') && isValid;
      isValid = validateField(document.getElementById('city'), 'cityErr') && isValid;
      isValid = validateField(document.getElementById('state'), 'stateErr') && isValid;
      isValid = validateField(document.getElementById('zipCode'), 'zipCodeErr') && isValid;
      isValid = validateRadio('ageGroup', 'ageGroupErr') && isValid;
      isValid = validateRadio('workAuth', 'workAuthErr') && isValid;
      isValid = validateRadio('scoutingStatus', 'scoutingStatusErr') && isValid;

      // Conditional: minor guardian details
      if (isUnder18()) {
        isValid = validateField(document.getElementById('guardianName'), 'guardianNameErr') && isValid;
        isValid = validateField(document.getElementById('guardianPhone'), 'guardianPhoneErr') && isValid;
        isValid = validateField(document.getElementById('guardianEmail'), 'guardianEmailErr', isEmail) && isValid;
      }

      // Conditional: scouting registration info
      const scoutingRadios = document.getElementsByName('scoutingStatus');
      let isScout = false;
      for (const r of scoutingRadios) {
        if (r.checked && r.value === 'Registered') isScout = true;
      }
      if (isScout) {
        isValid = validateField(document.getElementById('scoutCouncil'), 'scoutCouncilErr') && isValid;
        isValid = validateField(document.getElementById('scoutUnit'), 'scoutUnitErr') && isValid;
      }
    } 
    else if (step === 2) {
      isValid = validateField(document.getElementById('startDate'), 'startDateErr') && isValid;
      isValid = validateField(document.getElementById('endDate'), 'endDateErr') && isValid;
      
      // Position ranking validation (must rank exactly 3 choices: 1st, 2nd, and 3rd choices uniquely)
      const selectElements = document.querySelectorAll('.pref-select');
      const rankings = [];
      selectElements.forEach(sel => {
        if (sel.value !== 'none') {
          rankings.push(sel.value);
        }
      });
      
      // Check that rankings has exactly 1, 2, and 3
      const rankError = document.getElementById('preferencesErr');
      const hasUniqueThree = rankings.length === 3 && 
                              rankings.includes('1') && 
                              rankings.includes('2') && 
                              rankings.includes('3');
      
      if (!hasUniqueThree) {
        selectElements.forEach(s => s.classList.add('invalid'));
        rankError.classList.remove('hidden');
        isValid = false;
      } else {
        selectElements.forEach(s => s.classList.remove('invalid'));
        rankError.classList.add('hidden');
      }

      // NCS details validation
      const ncsRadios = document.getElementsByName('ncsHolder');
      let isNcs = false;
      for (const r of ncsRadios) {
        if (r.checked && r.value === 'Yes') isNcs = true;
      }
      if (isNcs) {
        isValid = validateField(document.getElementById('ncsSection'), 'ncsSectionErr') && isValid;
        isValid = validateField(document.getElementById('ncsExpiration'), 'ncsExpirationErr') && isValid;
      }

      isValid = validateField(document.getElementById('tshirtSize'), 'tshirtSizeErr') && isValid;
      isValid = validateField(document.getElementById('jacketSize'), 'jacketSizeErr') && isValid;
    } 
    else if (step === 3) {
      // Previous staff details validation
      const prevStaffRadios = document.getElementsByName('prevStaff');
      let hadPrev = false;
      for (const r of prevStaffRadios) {
        if (r.checked && r.value === 'Yes') hadPrev = true;
      }
      if (hadPrev) {
        isValid = validateField(document.getElementById('prevStaffInfo'), 'prevStaffInfoErr') && isValid;
      }

      // Education validations
      if (document.getElementById('eduHighschool').checked) {
        isValid = validateField(document.getElementById('hsYear'), 'hsYearErr') && isValid;
      }
      if (document.getElementById('eduCollege').checked) {
        isValid = validateField(document.getElementById('collegeType'), 'collegeTypeErr') && isValid;
        isValid = validateField(document.getElementById('collegeYear'), 'collegeYearErr') && isValid;
      }

      // Three references are absolutely required
      isValid = validateField(document.getElementById('ref1Name'), 'ref1NameErr') && isValid;
      isValid = validateField(document.getElementById('ref1Relation'), 'ref1RelationErr') && isValid;
      isValid = validateField(document.getElementById('ref1Contact'), 'ref1ContactErr') && isValid;

      isValid = validateField(document.getElementById('ref2Name'), 'ref2NameErr') && isValid;
      isValid = validateField(document.getElementById('ref2Relation'), 'ref2RelationErr') && isValid;
      isValid = validateField(document.getElementById('ref2Contact'), 'ref2ContactErr') && isValid;

      isValid = validateField(document.getElementById('ref3Name'), 'ref3NameErr') && isValid;
      isValid = validateField(document.getElementById('ref3Relation'), 'ref3RelationErr') && isValid;
      isValid = validateField(document.getElementById('ref3Contact'), 'ref3ContactErr') && isValid;
    } 
    else if (step === 4) {
      // Initials verification (must have some initials filled)
      const initialsLength = (val) => val.trim().length >= 1 && val.trim().length <= 3;
      
      isValid = validateField(document.getElementById('initAltitude'), 'initAltitudeErr', initialsLength) && isValid;
      isValid = validateField(document.getElementById('initWildlife'), 'initWildlifeErr', initialsLength) && isValid;
      isValid = validateField(document.getElementById('initWater'), 'initWaterErr', initialsLength) && isValid;
      isValid = validateField(document.getElementById('initMedical'), 'initMedicalErr', initialsLength) && isValid;

      // Life safety certifications dates
      if (document.getElementById('certCpr').checked) {
        isValid = validateField(document.getElementById('certCprExp'), 'certCprExpErr') && isValid;
      }
      if (document.getElementById('certWfa').checked) {
        isValid = validateField(document.getElementById('certWfaExp'), 'certWfaExpErr') && isValid;
      }
      if (document.getElementById('certOther').checked) {
        isValid = validateField(document.getElementById('certOtherDesc'), 'certOtherDescErr') && isValid;
      }
    }
    else if (step === 5) {
      // Legal consent check
      const consentCheck = document.getElementById('legalConsent');
      const consentErr = document.getElementById('legalConsentErr');
      if (!consentCheck.checked) {
        consentErr.classList.remove('hidden');
        isValid = false;
      } else {
        consentErr.classList.add('hidden');
      }

      // Applicant typed name and date
      isValid = validateField(document.getElementById('typedSignature'), 'typedSignatureErr') && isValid;
      isValid = validateField(document.getElementById('signatureDate'), 'signatureDateErr') && isValid;

      // Draw signature pad validation
      const sigPadErr = document.getElementById('sigPadErr');
      if (!isSigDrawn) {
        sigPad.style.borderColor = 'var(--fire-500)';
        sigPadErr.classList.remove('hidden');
        isValid = false;
      } else {
        sigPad.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        sigPadErr.classList.add('hidden');
      }

      // Guardian signature if minor
      if (isUnder18()) {
        isValid = validateField(document.getElementById('guardianTypedSignature'), 'guardianTypedSignatureErr') && isValid;
        isValid = validateField(document.getElementById('guardianSignatureDate'), 'guardianSignatureDateErr') && isValid;
      }
    }

    return isValid;
  };

  // 6. POPULATE SUMMARY IN STEP 5
  function populateSummary() {
    const fName = document.getElementById('firstName').value;
    const mName = document.getElementById('middleName').value;
    const lName = document.getElementById('lastName').value;
    const nickname = document.getElementById('preferredName').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const street = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const state = document.getElementById('state').value;
    const zip = document.getElementById('zipCode').value;
    
    // Name
    const fullName = `${fName} ${mName ? mName + ' ' : ''}${lName}${nickname ? ` ("${nickname}")` : ''}`;
    document.getElementById('revName').textContent = fullName;
    
    // Contact
    document.getElementById('revContact').textContent = `${email} | ${phone}`;
    
    // Address
    document.getElementById('revAddress').textContent = `${street}, ${city}, ${state} ${zip}`;

    // Age Group & Work Auth
    let ageLabel = '--';
    const ageRadios = document.getElementsByName('ageGroup');
    for (const r of ageRadios) {
      if (r.checked) {
        if (r.value === '14') ageLabel = '14 Years (CIT)';
        if (r.value === '16') ageLabel = '16+ Years (Junior Staff)';
        if (r.value === '18') ageLabel = '18+ Years (Area Director)';
        if (r.value === '21') ageLabel = '21+ Years (Camp Management)';
      }
    }
    
    let authLabel = '--';
    const authRadios = document.getElementsByName('workAuth');
    for (const r of authRadios) {
      if (r.checked) authLabel = r.value === 'Yes' ? 'Authorized' : 'Not Authorized';
    }
    document.getElementById('revAgeAuth').textContent = `${ageLabel} / ${authLabel}`;

    // Scouting membership
    let scoutingLabel = 'Not Registered';
    const scoutingRadios = document.getElementsByName('scoutingStatus');
    for (const r of scoutingRadios) {
      if (r.checked && r.value === 'Registered') {
        scoutingLabel = `Registered (${document.getElementById('scoutCouncil').value}, Unit: ${document.getElementById('scoutUnit').value})`;
      }
    }
    document.getElementById('revScouting').textContent = scoutingLabel;

    // Availability dates
    const sDate = document.getElementById('startDate').value;
    const eDate = document.getElementById('endDate').value;
    document.getElementById('revDates').textContent = `${sDate} to ${eDate}`;

    // Expertise
    const expertises = [];
    const expertElements = document.getElementsByName('expertise');
    expertElements.forEach(el => {
      if (el.checked) expertises.push(el.value);
    });
    document.getElementById('revExpertise').textContent = expertises.length > 0 ? expertises.join(', ') : 'None selected';

    // Preferences ranked
    const prefs = [];
    const pMgmt = document.getElementsByName('pref_management')[0].value;
    const pDir = document.getElementsByName('pref_director')[0].value;
    const pInst = document.getElementsByName('pref_instructor')[0].value;
    const pSupp = document.getElementsByName('pref_support')[0].value;
    const pCit = document.getElementsByName('pref_cit')[0].value;

    if (pMgmt !== 'none') prefs.push({ name: 'Camp Management', rank: parseInt(pMgmt) });
    if (pDir !== 'none') prefs.push({ name: 'Area Director', rank: parseInt(pDir) });
    if (pInst !== 'none') prefs.push({ name: 'Area Instructor', rank: parseInt(pInst) });
    if (pSupp !== 'none') prefs.push({ name: 'Support Staff', rank: parseInt(pSupp) });
    if (pCit !== 'none') prefs.push({ name: 'Counselor-in-Training', rank: parseInt(pCit) });

    prefs.sort((a, b) => a.rank - b.rank);
    const rankedStrs = prefs.map(p => `#${p.rank}: ${p.name}`);
    document.getElementById('revPreferences').textContent = rankedStrs.length > 0 ? rankedStrs.join(', ') : 'No choices ranked';
  }

  // 7. LOCAL STORAGE DRAFT SAVING/HYDRATION
  function saveDraft() {
    const formData = {};
    const inputs = staffAppForm.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], input[type="date"], input[type="number"], select, textarea');
    
    inputs.forEach(input => {
      if (input.name) formData[input.name] = input.value;
    });

    // Checkboxes (Expertise & Certifications & Education)
    const checkboxes = staffAppForm.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(cb => {
      formData[cb.id || cb.name + '_' + cb.value] = cb.checked;
    });

    // Radios
    const radios = staffAppForm.querySelectorAll('input[type="radio"]');
    radios.forEach(radio => {
      if (radio.checked) {
        formData[radio.name] = radio.value;
      }
    });

    localStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
  }

  function loadDraft() {
    const draftStr = localStorage.getItem(DRAFT_KEY);
    if (!draftStr) return;
    try {
      const draft = JSON.parse(draftStr);
      
      // Populate text, date, numbers, selects
      for (const name in draft) {
        const value = draft[name];
        
        // Handle input fields directly matching by name
        const input = staffAppForm.querySelector(`[name="${name}"]`);
        if (input) {
          if (input.type === 'radio') {
            const specificRadio = staffAppForm.querySelector(`[name="${name}"][value="${value}"]`);
            if (specificRadio) specificRadio.checked = true;
          } else {
            input.value = value;
          }
        }

        // Handle checkbox by ID or custom selector
        const cb = document.getElementById(name);
        if (cb && cb.type === 'checkbox') {
          cb.checked = value;
        }
      }

      // Programmatic checkboxes list (Expertise)
      const expertiseElements = document.getElementsByName('expertise');
      expertiseElements.forEach(el => {
        const val = el.value;
        if (draft[`expertise_${val}`] !== undefined) {
          el.checked = draft[`expertise_${val}`];
        }
      });

      // Trigger change events manually on conditional triggers to toggle layouts
      const triggerRadios = ['ageGroup', 'scoutingStatus', 'ncsHolder', 'prevStaff'];
      triggerRadios.forEach(name => {
        const checked = staffAppForm.querySelector(`[name="${name}"]:checked`);
        if (checked) {
          checked.dispatchEvent(new Event('change'));
        }
      });

      const checkboxes = ['eduHighschool', 'eduCollege', 'certCpr', 'certWfa', 'certOther'];
      checkboxes.forEach(id => {
        const cb = document.getElementById(id);
        if (cb && cb.checked) {
          cb.dispatchEvent(new Event('change'));
        }
      });
      
    } catch (err) {
      console.warn('Failed to parse staff application draft:', err);
    }
  }

  // 8. FORM SUBMISSION
  async function submitApplication() {
    btnNext.disabled = true;
    btnNext.innerHTML = 'Submitting...';

    // Compile payload
    const payload = {
      firstName: document.getElementById('firstName').value.trim(),
      middleName: document.getElementById('middleName').value.trim(),
      lastName: document.getElementById('lastName').value.trim(),
      preferredName: document.getElementById('preferredName').value.trim(),
      address: document.getElementById('address').value.trim(),
      city: document.getElementById('city').value.trim(),
      state: document.getElementById('state').value.trim().toUpperCase(),
      zipCode: document.getElementById('zipCode').value.trim(),
      phone: document.getElementById('phone').value.trim(),
      email: document.getElementById('email').value.trim(),
      
      ageGroup: staffAppForm.querySelector('name="ageGroup":checked')?.value || staffAppForm.querySelector('input[name="ageGroup"]:checked')?.value,
      workAuth: staffAppForm.querySelector('input[name="workAuth"]:checked')?.value,
      scoutingStatus: staffAppForm.querySelector('input[name="scoutingStatus"]:checked')?.value,
      
      scoutCouncil: document.getElementById('scoutCouncil').value.trim(),
      scoutUnit: document.getElementById('scoutUnit').value.trim(),
      
      // Step 2
      startDate: document.getElementById('startDate').value,
      endDate: document.getElementById('endDate').value,
      conflicts: document.getElementById('conflicts').value.trim(),
      
      preferences: {
        campManagement: document.getElementsByName('pref_management')[0].value,
        areaDirector: document.getElementsByName('pref_director')[0].value,
        areaInstructor: document.getElementsByName('pref_instructor')[0].value,
        supportStaff: document.getElementsByName('pref_support')[0].value,
        counselorInTraining: document.getElementsByName('pref_cit')[0].value
      },
      
      expertise: Array.from(document.querySelectorAll('input[name="expertise"]:checked')).map(cb => cb.value),
      expertiseDesc: document.getElementById('expertiseDesc').value.trim(),
      
      ncsHolder: staffAppForm.querySelector('input[name="ncsHolder"]:checked')?.value,
      ncsSection: document.getElementById('ncsSection').value.trim(),
      ncsExpiration: document.getElementById('ncsExpiration').value,
      
      tshirtSize: document.getElementById('tshirtSize').value,
      jacketSize: document.getElementById('jacketSize').value,
      
      // Step 3
      scoutRank: document.getElementById('scoutRank').value.trim(),
      scoutLeadership: document.getElementById('scoutLeadership').value.trim(),
      oaMember: staffAppForm.querySelector('input[name="oaMember"]:checked')?.value,
      
      prevStaff: staffAppForm.querySelector('input[name="prevStaff"]:checked')?.value,
      prevStaffInfo: document.getElementById('prevStaffInfo').value.trim(),
      
      recentEmployer: document.getElementById('recentEmployer').value.trim(),
      employmentDates: document.getElementById('employmentDates').value.trim(),
      employmentDuties: document.getElementById('employmentDuties').value.trim(),
      
      education: {
        highschool: document.getElementById('eduHighschool').checked,
        highschoolYear: document.getElementById('hsYear').value,
        college: document.getElementById('eduCollege').checked,
        collegeType: document.getElementById('collegeType').value.trim(),
        collegeYear: document.getElementById('collegeYear').value
      },
      
      currentSchool: document.getElementById('currentSchool').value.trim(),
      extracurriculars: document.getElementById('extracurriculars').value.trim(),
      
      references: [
        {
          name: document.getElementById('ref1Name').value.trim(),
          relationship: document.getElementById('ref1Relation').value.trim(),
          contact: document.getElementById('ref1Contact').value.trim()
        },
        {
          name: document.getElementById('ref2Name').value.trim(),
          relationship: document.getElementById('ref2Relation').value.trim(),
          contact: document.getElementById('ref2Contact').value.trim()
        },
        {
          name: document.getElementById('ref3Name').value.trim(),
          relationship: document.getElementById('ref3Relation').value.trim(),
          contact: document.getElementById('ref3Contact').value.trim()
        }
      ],
      
      // Step 4
      initials: {
        altitude: document.getElementById('initAltitude').value.trim().toUpperCase(),
        wildlife: document.getElementById('initWildlife').value.trim().toUpperCase(),
        water: document.getElementById('initWater').value.trim().toUpperCase(),
        medical: document.getElementById('initMedical').value.trim().toUpperCase()
      },
      
      certifications: {
        cpr: document.getElementById('certCpr').checked,
        cprExpiration: document.getElementById('certCprExp').value,
        wfa: document.getElementById('certWfa').checked,
        wfaExpiration: document.getElementById('certWfaExp').value,
        other: document.getElementById('certOther').checked,
        otherDetails: document.getElementById('certOtherDesc').value.trim()
      },
      
      // Step 5
      consentApproved: document.getElementById('legalConsent').checked,
      signatureDate: document.getElementById('signatureDate').value,
      typedSignature: document.getElementById('typedSignature').value.trim(),
      handSignatureData: sigPad.toDataURL(), // Save coordinates as image
      
      guardianConsent: {
        guardianTypedSignature: document.getElementById('guardianTypedSignature').value.trim(),
        guardianSignatureDate: document.getElementById('guardianSignatureDate').value
      }
    };

    // Guardian details (conditional parsing helper)
    if (isUnder18()) {
      payload.guardianInfo = {
        name: document.getElementById('guardianName').value.trim(),
        phone: document.getElementById('guardianPhone').value.trim(),
        email: document.getElementById('guardianEmail').value.trim()
      };
    }

    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.success) {
        // Clear local storage draft
        localStorage.removeItem(DRAFT_KEY);

        // Display success summary
        document.getElementById('resAppId').textContent = data.id;
        document.getElementById('resAppName').textContent = `${payload.firstName} ${payload.lastName}`;
        document.getElementById('resAppDate').textContent = new Date().toLocaleDateString();
        
        // Formulate preferences summary
        const selectedPrefs = [];
        if (payload.preferences.campManagement !== 'none') selectedPrefs.push(`Management (${payload.preferences.campManagement})`);
        if (payload.preferences.areaDirector !== 'none') selectedPrefs.push(`Director (${payload.preferences.areaDirector})`);
        if (payload.preferences.areaInstructor !== 'none') selectedPrefs.push(`Instructor (${payload.preferences.areaInstructor})`);
        if (payload.preferences.supportStaff !== 'none') selectedPrefs.push(`Support (${payload.preferences.supportStaff})`);
        if (payload.preferences.counselorInTraining !== 'none') selectedPrefs.push(`CIT (${payload.preferences.counselorInTraining})`);
        document.getElementById('resAppPrefs').textContent = selectedPrefs.join(', ');

        // Reveal Success Screen, hide stepper nodes & form elements
        formSteps.forEach(s => s.classList.remove('active'));
        successScreen.classList.remove('hidden');
        wizardFooter.classList.add('hidden');
        document.querySelector('.stepper-container').style.opacity = '0.3';
      } else {
        alert('Failed to submit application: ' + (data.error || 'Unknown error'));
        btnNext.disabled = false;
        btnNext.innerHTML = 'Submit Application ⚜️';
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Network error. Unable to connect to database. Please check your connection and try again.');
      btnNext.disabled = false;
      btnNext.innerHTML = 'Submit Application ⚜️';
    }
  }

  // 9. EVENT LISTENERS
  btnNext.addEventListener('click', () => {
    // Validate current step
    if (!validateStep(currentStep)) {
      return;
    }

    if (currentStep < totalSteps) {
      currentStep++;
      updateStepUI();
    } else {
      // Step 5 Submit trigger
      submitApplication();
    }
  });

  btnBack.addEventListener('click', () => {
    if (currentStep > 1) {
      currentStep--;
      updateStepUI();
    }
  });

  // Enable step indicator node clicks for completed/previous steps
  stepNodes.forEach(node => {
    node.addEventListener('click', () => {
      const targetStep = parseInt(node.getAttribute('data-step'));
      if (targetStep < currentStep) {
        currentStep = targetStep;
        updateStepUI();
      } else if (targetStep > currentStep) {
        // Can only jump forward if all intermediate steps are validated
        let stepsAreValid = true;
        for (let s = currentStep; s < targetStep; s++) {
          if (!validateStep(s)) {
            stepsAreValid = false;
            currentStep = s;
            updateStepUI();
            break;
          }
        }
        if (stepsAreValid) {
          currentStep = targetStep;
          updateStepUI();
        }
      }
    });
  });

  btnApplyAgain.addEventListener('click', () => {
    staffAppForm.reset();
    isSigDrawn = false;
    sigCtx.clearRect(0, 0, sigPad.width, sigPad.height);
    currentStep = 1;
    
    // Hide Success Screen, reveal form elements
    successScreen.classList.add('hidden');
    wizardFooter.classList.remove('hidden');
    document.querySelector('.stepper-container').style.opacity = '1';
    
    // Set date of signature to today
    document.getElementById('signatureDate').value = new Date().toISOString().split('T')[0];

    updateStepUI();
    
    // Trigger conditionals hide
    document.getElementById('guardianSection').classList.add('hidden');
    document.getElementById('guardianSignatureSection').classList.add('hidden');
    document.getElementById('scoutingDetails').classList.add('hidden');
    document.getElementById('ncsDetails').classList.add('hidden');
    document.getElementById('prevStaffDetails').classList.add('hidden');
    document.getElementById('hsDetails').classList.add('hidden');
    document.getElementById('collegeDetails').classList.add('hidden');
    document.getElementById('cprDetails').classList.add('hidden');
    document.getElementById('wfaDetails').classList.add('hidden');
    document.getElementById('otherDetails').classList.add('hidden');
  });

  // 10. INITIALIZE
  initEmberCanvas();
  initSignaturePad();
  setupConditionals();
  
  // Set default dates
  document.getElementById('signatureDate').value = new Date().toISOString().split('T')[0];
  document.getElementById('guardianSignatureDate').value = new Date().toISOString().split('T')[0];
  
  // Hydrate draft if it exists
  loadDraft();
  
  // Initial UI trigger
  updateStepUI();
});
