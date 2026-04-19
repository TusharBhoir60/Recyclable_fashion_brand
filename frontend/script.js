/* ============================================
   RECYCLED FASHION APP — SHARED JAVASCRIPT
   ============================================ */

function safeParseJSON(value, fallback = null) {
  if (!value || typeof value !== 'string') return fallback;
  try {
    return JSON.parse(value);
  } catch (_err) {
    return fallback;
  }
}

// ── Handle User Login Form Submission ──
function handleUserLogin(event) {
  event.preventDefault();
  
  const email = document.getElementById('user-email').value;
  const password = document.getElementById('user-password').value;
  
  // Basic validation
  if (!email || !password) {
    showToast('Please fill in all fields');
    return;
  }
  
  // Check for pending signup data
  const pendingSignup = localStorage.getItem('pendingSignup');
  if (pendingSignup) {
    const signupData = safeParseJSON(pendingSignup);
    if (signupData && signupData.email === email && signupData.role === 'user') {
      // Use signup data for login
      var userData = {
        name: signupData.name,
        email: signupData.email,
        role: 'user',
        loginTime: new Date().toISOString()
      };
      // Clear pending signup
      localStorage.removeItem('pendingSignup');
    } else {
      // Normal login data
      var userData = {
        email: email,
        role: 'user',
        name: email.split('@')[0], // Extract name from email for demo
        loginTime: new Date().toISOString()
      };
    }
  } else {
    // Normal login data
    var userData = {
      email: email,
      role: 'user',
      name: email.split('@')[0], // Extract name from email for demo
      loginTime: new Date().toISOString()
    };
  }
  
  // Store in localStorage
  localStorage.setItem('user', JSON.stringify(userData));
  
  // Show success message
  showToast(`Login successful! Welcome back!`);
  
  // Redirect to user dashboard
  setTimeout(() => {
    window.location.href = '/dashboard';
  }, 1500);
}

// ── Handle Admin Login Form Submission ──
function handleAdminLogin(event) {
  event.preventDefault();
  
  const email = document.getElementById('admin-email').value;
  const password = document.getElementById('admin-password').value;
  
  // Basic validation
  if (!email || !password) {
    showToast('Please fill in all fields');
    return;
  }
  
  // Check for pending signup data
  const pendingSignup = localStorage.getItem('pendingSignup');
  if (pendingSignup) {
    const signupData = safeParseJSON(pendingSignup);
    if (signupData && signupData.email === email && signupData.role === 'admin') {
      // Use signup data for login
      var userData = {
        name: signupData.name,
        email: signupData.email,
        role: 'admin',
        loginTime: new Date().toISOString()
      };
      // Clear pending signup
      localStorage.removeItem('pendingSignup');
    } else {
      // Normal login data
      var userData = {
        email: email,
        role: 'admin',
        name: 'Admin', // Default admin name
        loginTime: new Date().toISOString()
      };
    }
  } else {
    // Normal login data
    var userData = {
      email: email,
      role: 'admin',
      name: 'Admin', // Default admin name
      loginTime: new Date().toISOString()
    };
  }
  
  // Store in localStorage
  localStorage.setItem('user', JSON.stringify(userData));
  
  // Show success message
  showToast(`Login successful! Welcome back Admin!`);
  
  // Redirect to admin dashboard
  setTimeout(() => {
    window.location.href = '/admin/dashboard';
  }, 1500);
}

// ── Toggle Between Login Forms ──
function toggleLoginType(type) {
  const userForm = document.getElementById('user-login-form');
  const adminForm = document.getElementById('admin-login-form');
  const showUserBtn = document.getElementById('show-user-login');
  const showAdminBtn = document.getElementById('show-admin-login');
  
  if (type === 'admin') {
    userForm.style.display = 'none';
    adminForm.style.display = 'block';
    showUserBtn.style.display = 'inline-block';
    showAdminBtn.style.display = 'none';
  } else {
    userForm.style.display = 'block';
    adminForm.style.display = 'none';
    showUserBtn.style.display = 'none';
    showAdminBtn.style.display = 'inline-block';
  }
}

// ── Toggle Signup Fields Based on Role ──
function toggleSignupFields() {
  const roleRadios = document.querySelectorAll('input[name="role"]');
  const userFields = document.getElementById('user-signup-fields');
  const adminFields = document.getElementById('admin-signup-fields');
  
  if (!userFields || !adminFields) return; // Only run on signup page
  
  roleRadios.forEach(radio => {
    radio.addEventListener('change', function() {
      if (this.value === 'admin') {
        userFields.style.display = 'none';
        adminFields.style.display = 'block';
        // Remove required from user fields
        document.querySelectorAll('#user-signup-fields [required]').forEach(field => {
          field.removeAttribute('required');
        });
        // Add required to admin fields
        document.querySelectorAll('#admin-signup-fields input').forEach(field => {
          field.setAttribute('required', '');
        });
      } else {
        userFields.style.display = 'block';
        adminFields.style.display = 'none';
        // Add required to user fields
        document.querySelectorAll('#user-signup-fields input, #user-signup-fields textarea').forEach(field => {
          field.setAttribute('required', '');
        });
        // Remove required from admin fields
        document.querySelectorAll('#admin-signup-fields [required]').forEach(field => {
          field.removeAttribute('required');
        });
      }
    });
  });
}

// ── Pre-fill Login Form from Pending Signup ──
function prefillLoginForm() {
  const pendingSignup = localStorage.getItem('pendingSignup');
  if (pendingSignup) {
    const signupData = safeParseJSON(pendingSignup);
    if (!signupData) {
      localStorage.removeItem('pendingSignup');
      return;
    }
    
    // Set role based on signup
    const roleRadio = document.querySelector(`input[name="role"][value="${signupData.role}"]`);
    if (roleRadio) {
      roleRadio.checked = true;
      // Trigger field toggle
      if (signupData.role === 'admin') {
        document.getElementById('user-login-fields').style.display = 'none';
        document.getElementById('admin-login-fields').style.display = 'block';
        // Pre-fill admin email
        const emailInput = document.getElementById('admin-email');
        if (emailInput && signupData.email) {
          emailInput.value = signupData.email;
        }
      } else {
        document.getElementById('user-login-fields').style.display = 'block';
        document.getElementById('admin-login-fields').style.display = 'none';
        // Pre-fill user email
        const emailInput = document.getElementById('user-email');
        if (emailInput && signupData.email) {
          emailInput.value = signupData.email;
        }
      }
    }
  }
}

// ── Handle Role Selection Highlighting ──
function highlightSelectedRole() {
  const roleOptions = document.querySelectorAll('.role-option');
  const roleRadios = document.querySelectorAll('input[name="role"]');
  
  // Initialize default state (user role)
  const defaultChecked = document.querySelector('input[name="role"]:checked');
  if (defaultChecked) {
    const defaultIndex = Array.from(roleRadios).indexOf(defaultChecked);
    highlightRoleOption(defaultIndex);
  }
  
  // Add event listeners for changes
  roleRadios.forEach((radio, index) => {
    radio.addEventListener('change', function() {
      highlightRoleOption(index);
    });
  });
}

// ── Highlight Specific Role Option ──
function highlightRoleOption(index) {
  const roleOptions = document.querySelectorAll('.role-option');
  
  // Remove all highlights
  roleOptions.forEach(option => {
    option.style.background = '';
    option.style.borderColor = '';
    option.style.transform = '';
    option.style.boxShadow = '';
    
    // Reset icon styles
    const icon = option.querySelector('.role-icon');
    icon.style.background = '';
    icon.style.borderColor = '';
    icon.style.transform = '';
    
    // Reset text styles
    const text = option.querySelector('.role-text');
    text.style.color = '';
    text.style.fontWeight = '';
  });
  
  // Add highlight to selected option
  const selectedOption = roleOptions[index];
  selectedOption.style.background = 'var(--green-bg)';
  selectedOption.style.borderColor = 'var(--green-mid)';
  selectedOption.style.transform = 'translateY(-2px)';
  selectedOption.style.boxShadow = '0 4px 12px rgba(34, 197, 94, 0.15)';
  
  // Update icon
  const icon = selectedOption.querySelector('.role-icon');
  icon.style.background = 'var(--green-mid)';
  icon.style.borderColor = 'var(--green-dark)';
  icon.style.transform = 'scale(1.1)';
  
  // Update text
  const text = selectedOption.querySelector('.role-text');
  text.style.color = 'var(--green-dark)';
  text.style.fontWeight = '600';
}

// ── Smooth Scroll to Section ──
function scrollToSection(sectionId) {
  if (event) event.preventDefault();
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
    
    // Update active nav link highlighting
    const navLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + sectionId) {
        link.classList.add('active');
      }
    });
  }
}

// ── Show Role Selection Modal ──
function showRoleSelection(action) {
  const modal = document.getElementById('roleModal');
  modal.classList.add('show');
  
  // Store the action to perform after role selection
  window.pendingAction = action;
}

// ── Close Role Modal ──
function closeRoleModal() {
  const modal = document.getElementById('roleModal');
  modal.classList.remove('show');
  window.pendingAction = null;
}

// ── Select Role and Redirect ──
function selectRoleAndRedirect(role) {
  closeRoleModal();
  
  if (role === 'admin') {
    // Redirect to admin login
    window.location.href = '/login';
  } else {
    // Redirect to appropriate login/signup based on pending action
    if (window.pendingAction === 'login') {
      window.location.href = '/login';
    } else if (window.pendingAction === 'signup') {
      window.location.href = '/signup';
    } else {
      // Default to login
      window.location.href = '/login';
    }
  }
}

// ── Check Login and Redirect ──
function checkLoginAndRedirect(destination) {
  // Check if user is logged in
  const user = localStorage.getItem('user');
  
  if (!user) {
    // User is not logged in, show login prompt
    showToast(`Please login to ${destination === 'shop' ? 'browse the shop' : 'start selling'}`);
    setTimeout(() => {
      window.location.href = '/login';
    }, 1500);
    return;
  }
  
  // User is logged in, redirect to destination
  window.location.href = `${destination}.html`;
}

// ── Toggle Login Fields Based on Role ──
function toggleLoginFields() {
  const roleRadios = document.querySelectorAll('input[name="role"]');
  const userFields = document.getElementById('user-login-fields');
  const adminFields = document.getElementById('admin-login-fields');
  
  if (!userFields || !adminFields) return; // Only run on login page
  
  // Set initial state
  const checkedRadio = document.querySelector('input[name="role"]:checked');
  if (checkedRadio) {
    if (checkedRadio.value === 'admin') {
      userFields.style.display = 'none';
      adminFields.style.display = 'block';
      // Remove required from user fields
      document.querySelectorAll('#user-login-fields [required]').forEach(field => {
        field.removeAttribute('required');
      });
      // Add required to admin fields
      document.querySelectorAll('#admin-login-fields input').forEach(field => {
        field.setAttribute('required', '');
      });
    } else {
      userFields.style.display = 'block';
      adminFields.style.display = 'none';
      // Add required to user fields
      document.querySelectorAll('#user-login-fields input').forEach(field => {
        field.setAttribute('required', '');
      });
      // Remove required from admin fields
      document.querySelectorAll('#admin-login-fields [required]').forEach(field => {
        field.removeAttribute('required');
      });
    }
  }
  
  roleRadios.forEach(radio => {
    radio.addEventListener('change', function() {
      if (this.value === 'admin') {
        userFields.style.display = 'none';
        adminFields.style.display = 'block';
        // Remove required from user fields
        document.querySelectorAll('#user-login-fields [required]').forEach(field => {
          field.removeAttribute('required');
        });
        // Add required to admin fields
        document.querySelectorAll('#admin-login-fields input').forEach(field => {
          field.setAttribute('required', '');
        });
      } else {
        userFields.style.display = 'block';
        adminFields.style.display = 'none';
        // Add required to user fields
        document.querySelectorAll('#user-login-fields input').forEach(field => {
          field.setAttribute('required', '');
        });
        // Remove required from admin fields
        document.querySelectorAll('#admin-login-fields [required]').forEach(field => {
          field.removeAttribute('required');
        });
      }
    });
  });
}

// ── Handle Login Form Submission ──
function handleLogin(event) {
  event.preventDefault();
  
  const role = document.querySelector('input[name="role"]:checked').value;
  console.log('Selected role:', role);
  
  let email, password;
  
  if (role === 'admin') {
    // Admin login - get admin fields
    email = document.getElementById('admin-email').value;
    password = document.getElementById('admin-password').value;
  } else {
    // User login - get user fields
    email = document.getElementById('user-email').value;
    password = document.getElementById('user-password').value;
  }
  
  // Basic validation
  if (!email || !password) {
    showToast('Please fill in all fields');
    return;
  }
  
  // Check for pending signup data
  const pendingSignup = localStorage.getItem('pendingSignup');
  if (pendingSignup) {
    const signupData = safeParseJSON(pendingSignup);
    if (signupData && signupData.email === email && signupData.role === role) {
      // Use signup data for login
      var userData = {
        name: signupData.name,
        email: signupData.email,
        role: signupData.role,
        loginTime: new Date().toISOString()
      };
      // Clear pending signup
      localStorage.removeItem('pendingSignup');
    } else {
      // Normal login data
      var userData = {
        email: email,
        role: role,
        name: role === 'admin' ? 'Admin' : email.split('@')[0],
        loginTime: new Date().toISOString()
      };
    }
  } else {
    // Normal login data
    var userData = {
      email: email,
      role: role,
      name: role === 'admin' ? 'Admin' : email.split('@')[0],
      loginTime: new Date().toISOString()
    };
  }
  
  // Store in localStorage
  localStorage.setItem('user', JSON.stringify(userData));
  
  // Show success message
  showToast(`Login successful! Welcome back${userData.role === 'admin' ? ' Admin' : ''}!`);
  
  // Debug: log the role and redirect URL
  console.log('User role:', userData.role);
  console.log('Redirecting to:', userData.role === 'admin' ? 'admin/dashboard.html' : 'dashboard.html');
  
  // Redirect based on role
  setTimeout(() => {
    if (userData.role === 'admin') {
      window.location.href = '/admin/dashboard';
    } else {
      window.location.href = '/dashboard';
    }
  }, 1500);
}

// ── Handle Signup Form Submission ──
function handleSignup(event) {
  event.preventDefault();
  
  const role = document.querySelector('input[name="role"]:checked').value;
  
  let fullname, email, password;
  
  if (role === 'admin') {
    // Admin signup - get admin fields
    email = document.getElementById('admin-email').value;
    password = document.getElementById('admin-password').value;
    const confirmPassword = document.getElementById('admin-confirm-password').value;
    fullname = 'Admin'; // Default name for admin
    
    // Basic validation for admin
    if (!email || !password) {
      showToast('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      showToast('Passwords do not match');
      return;
    }
  } else {
    // User signup - get user fields
    fullname = document.getElementById('fullname').value;
    email = document.getElementById('s-email').value;
    password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    // Basic validation for user
    if (!fullname || !email || !password) {
      showToast('Please fill in all required fields');
      return;
    }
    
    if (password !== confirmPassword) {
      showToast('Passwords do not match');
      return;
    }
  }
  
  // Store user data temporarily (will be cleared for login)
  const userData = {
    name: fullname,
    email: email,
    role: role,
    signupTime: new Date().toISOString()
  };
  
  // Store signup data in temporary storage
  localStorage.setItem('pendingSignup', JSON.stringify(userData));
  
  // Clear any existing user session
  localStorage.removeItem('user');
  
  // Show success message
  showToast(`Account created successfully! Please login to continue.`);
  
  // Redirect to login page
  setTimeout(() => {
    window.location.href = '/login';
  }, 1500);
}

// ── Check Login and Add to Cart ──
function checkLoginAndAddToCart() {
  // Check if user is logged in
  const user = localStorage.getItem('user');
  
  if (!user) {
    // User is not logged in, show login prompt
    showToast('Please login to add items to cart');
    setTimeout(() => {
      window.location.href = '/login';
    }, 1500);
    return;
  }
  
  // User is logged in, add to cart
  const productName = event.target.closest('.product-card').querySelector('.product-card__name').textContent;
  const productPrice = event.target.closest('.product-card').querySelector('.product-card__price').textContent;
  
  // Get current cart or initialize empty array
  let cart = safeParseJSON(localStorage.getItem('cart'), []);
  
  // Add item to cart
  const newItem = {
    id: Date.now(),
    name: productName,
    price: productPrice,
    quantity: 1
  };
  
  cart.push(newItem);
  localStorage.setItem('cart', JSON.stringify(cart));
  
  // Show success message
  showToast(`${productName} added to cart!`);
  
  // Update cart badge if it exists
  updateCartBadge();
}

// ── Update Cart Badge ──
function updateCartBadge() {
  const cartBadge = document.querySelector('.cart-badge');
  if (cartBadge) {
    const cart = safeParseJSON(localStorage.getItem('cart'), []);
    cartBadge.textContent = cart.length;
  }
}

// ── Logout Function ──
function logout() {
  // Clear any stored user data
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  
  // Show toast message
  showToast('Logged out successfully');
  
  // Redirect to home page after a short delay
  setTimeout(() => {
    window.location.href = '/';
  }, 1000);
}

// ── Profile Edit/Save (Profile Page) ──
function toggleEdit() {
  const form = document.getElementById('profile-form');
  const saveWrap = document.getElementById('save-btn-wrap');
  const editBtn = document.getElementById('edit-btn');
  if (!form || !saveWrap || !editBtn) return;

  const fields = form.querySelectorAll('input, textarea');
  const isReadOnly = Array.from(fields).every((field) => field.disabled);

  fields.forEach((field) => {
    field.disabled = !isReadOnly;
    field.classList.toggle('readonly-active', !field.disabled);
  });

  saveWrap.style.display = isReadOnly ? 'block' : 'none';
  editBtn.textContent = isReadOnly ? 'Editing...' : '✏️ Edit';
}

function saveProfile() {
  const nameEl = document.getElementById('prof-name');
  const phoneEl = document.getElementById('prof-phone');
  const emailEl = document.getElementById('prof-email');
  const addrEl = document.getElementById('prof-addr');

  if (!nameEl || !phoneEl || !emailEl || !addrEl) return;

  const payload = {
    name: nameEl.value?.trim() || '',
    phone: phoneEl.value?.trim() || '',
    email: emailEl.value?.trim() || '',
    address: addrEl.value?.trim() || '',
  };

  if (!payload.name || !payload.phone || !payload.email) {
    showToast('Name, phone and email are required');
    return;
  }

  localStorage.setItem('userProfile', JSON.stringify(payload));
  showToast('Profile updated successfully');
  toggleEdit();
}

function hydrateProfileFromStorage() {
  const saved = safeParseJSON(localStorage.getItem('userProfile'));
  if (!saved) return;

  const nameEl = document.getElementById('prof-name');
  const phoneEl = document.getElementById('prof-phone');
  const emailEl = document.getElementById('prof-email');
  const addrEl = document.getElementById('prof-addr');

  if (nameEl && saved.name) nameEl.value = saved.name;
  if (phoneEl && saved.phone) phoneEl.value = saved.phone;
  if (emailEl && saved.email) emailEl.value = saved.email;
  if (addrEl && saved.address) addrEl.value = saved.address;
}

// ── Navbar Mobile Menu Toggle & Scroll Spy ──
function initNavbar() {
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
    });
  }

  const navLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');
  
  function updateActiveLink() {
    // If not on the homepage, just do simple exact matching
    if (window.location.pathname !== '/' && window.location.pathname !== '/index.html') {
      const currentLoc = window.location.href.split('#')[0];
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.href.split('#')[0] === currentLoc) {
          link.classList.add('active');
        }
      });
      return;
    }

    // ScrollSpy for the landing page
    let currentSection = '';
    const sections = ['shop-section', 'about-section'];
    
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        const rect = el.getBoundingClientRect();
        // If section is reasonably visible
        if (rect.top <= window.innerHeight / 2 && rect.bottom >= 0) {
          currentSection = id;
        }
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      
      if (currentSection) {
        if (href === '#' + currentSection) {
          link.classList.add('active');
        }
      } else {
        // No hash section active, highlight Home
        if (href === '/') {
          link.classList.add('active');
        }
      }
    });
  }

  // Initialize and bind
  updateActiveLink();
  window.addEventListener('scroll', updateActiveLink);
}

// ── Toast Notification ──
function showToast(message, duration = 3000) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span>✅</span> ${message}`;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

// ── Bulk Discount Field (Sell Page) ──
function initBulkDiscount() {
  const qtyInput = document.getElementById('quantity');
  const bulkField = document.getElementById('bulk-field');
  if (qtyInput && bulkField) {
    qtyInput.addEventListener('input', () => {
      const val = parseInt(qtyInput.value, 10);
      if (val > 1) {
        bulkField.classList.add('show');
      } else {
        bulkField.classList.remove('show');
      }
    });
  }
}

// ── Image Preview on Sell Page ──
function initImageUpload() {
  const fileInput  = document.getElementById('product-images');
  const previewStrip = document.getElementById('preview-strip');
  const uploadZone = document.getElementById('upload-zone');

  if (!fileInput) return;

  function renderPreviews(files) {
    previewStrip.innerHTML = '';
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = e => {
        const img = document.createElement('img');
        img.src = e.target.result;
        img.className = 'preview-img';
        previewStrip.appendChild(img);
      };
      reader.readAsDataURL(file);
    });
  }

  fileInput.addEventListener('change', e => renderPreviews(e.target.files));

  if (uploadZone) {
    uploadZone.addEventListener('click', () => fileInput.click());
    uploadZone.addEventListener('dragover', e => { e.preventDefault(); uploadZone.style.borderColor = 'var(--green-mid)'; });
    uploadZone.addEventListener('dragleave', () => { uploadZone.style.borderColor = ''; });
    uploadZone.addEventListener('drop', e => {
      e.preventDefault();
      uploadZone.style.borderColor = '';
      if (e.dataTransfer.files.length) {
        fileInput.files = e.dataTransfer.files;
        renderPreviews(e.dataTransfer.files);
      }
    });
  }
}

// ── Form Validation ──
function validateForm(formId) {
  const form = document.getElementById(formId);
  if (!form) return true;

  let valid = true;

  // Clear previous errors
  form.querySelectorAll('.form-error').forEach(el => el.classList.remove('show'));
  form.querySelectorAll('.form-control').forEach(el => el.style.borderColor = '');

  // Required fields
  form.querySelectorAll('[required]').forEach(input => {
    if (!input.value.trim()) {
      showFieldError(input, 'This field is required');
      valid = false;
    }
  });

  // Email fields
  form.querySelectorAll('[type="email"]').forEach(input => {
    if (input.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
      showFieldError(input, 'Please enter a valid email');
      valid = false;
    }
  });

  // Password match
  const pw  = form.querySelector('#password');
  const cpw = form.querySelector('#confirm-password');
  if (pw && cpw && pw.value !== cpw.value) {
    showFieldError(cpw, 'Passwords do not match');
    valid = false;
  }

  return valid;
}

function showFieldError(input, msg) {
  input.style.borderColor = '#e53e3e';
  let errEl = input.parentElement.querySelector('.form-error');
  if (!errEl) {
    errEl = document.createElement('span');
    errEl.className = 'form-error';
    input.parentElement.appendChild(errEl);
  }
  errEl.textContent = msg;
  errEl.classList.add('show');
}

// ── Quantity Controls (Product Detail) ──
function initQtyControls() {
  const minusBtn = document.getElementById('qty-minus');
  const plusBtn  = document.getElementById('qty-plus');
  const display  = document.getElementById('qty-display');
  if (!minusBtn || !plusBtn || !display) return;

  let qty = 1;
  minusBtn.addEventListener('click', () => { if (qty > 1) { qty--; display.value = qty; } });
  plusBtn.addEventListener('click', () => { qty++; display.value = qty; });
}

// ── Size Selection ──
function initSizeSelect() {
  const sizeBtns = document.querySelectorAll('.size-btn');
  sizeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      sizeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
}

// ── Payment Option Selection ──
function initPaymentOptions() {
  const opts = document.querySelectorAll('.payment-option');
  opts.forEach(opt => {
    opt.addEventListener('click', () => {
      opts.forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
    });
  });
}

// ── Add to Cart ──
function initAddToCart() {
  const atcBtn = document.getElementById('add-to-cart');
  if (atcBtn) {
    atcBtn.addEventListener('click', () => {
      showToast('Item added to cart!');
    });
  }
  const wishlistBtn = document.getElementById('add-to-wishlist');
  if (wishlistBtn) {
    wishlistBtn.addEventListener('click', () => {
      showToast('Added to wishlist! 💚');
    });
  }
}

// ── Cart Remove ──
function initCartActions() {
  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const item = this.closest('.cart-item');
      if (item) {
        item.style.opacity = '0';
        item.style.transform = 'translateX(40px)';
        item.style.transition = 'all .3s ease';
        setTimeout(() => item.remove(), 300);
        showToast('Item removed from cart');
      }
    });
  });
}

// ── Checkout Form ──
function initCheckout() {
  const placeOrderBtn = document.getElementById('place-order');
  if (placeOrderBtn) {
    placeOrderBtn.addEventListener('click', () => {
      if (validateForm('checkout-form')) {
        showToast('🎉 Order placed successfully!');
        setTimeout(() => { window.location.href = '../orders.html'; }, 1500);
      }
    });
  }
}

// ── Admin Toggle Block/Unblock ──
function initAdminActions() {
  document.querySelectorAll('.toggle-block').forEach(btn => {
    btn.addEventListener('click', function() {
      const isBlocked = this.textContent.trim() === 'Unblock';
      this.textContent = isBlocked ? 'Block' : 'Unblock';
      this.className = isBlocked ? 'btn-block toggle-block' : 'btn-unblock toggle-block';
      const row = this.closest('tr');
      if (row) {
        const badge = row.querySelector('.status-badge');
        if (badge) {
          badge.textContent = isBlocked ? 'Active' : 'Blocked';
          badge.className   = isBlocked ? 'status-badge status-active' : 'status-badge status-blocked';
        }
      }
      showToast(isBlocked ? 'User unblocked' : 'User blocked');
    });
  });

  document.querySelectorAll('.approve-product').forEach(btn => {
    btn.addEventListener('click', function() {
      const row = this.closest('tr');
      if (row) {
        const badge = row.querySelector('.status-badge');
        if (badge) { badge.textContent = 'Approved'; badge.className = 'status-badge status-approved'; }
      }
      showToast('Product approved ✅');
    });
  });

  document.querySelectorAll('.reject-product').forEach(btn => {
    btn.addEventListener('click', function() {
      const row = this.closest('tr');
      if (row) {
        const badge = row.querySelector('.status-badge');
        if (badge) { badge.textContent = 'Rejected'; badge.className = 'status-badge status-rejected'; }
      }
      showToast('Product rejected');
    });
  });

  document.querySelectorAll('.del-product').forEach(btn => {
    btn.addEventListener('click', function() {
      if (confirm('Delete this product?')) {
        const row = this.closest('tr');
        if (row) { row.style.opacity = '0'; setTimeout(() => row.remove(), 300); }
        showToast('Product deleted');
      }
    });
  });

  document.querySelectorAll('.update-status').forEach(sel => {
    sel.addEventListener('change', function() {
      showToast(`Order status updated to "${this.value}"`);
    });
  });
}

// ── Admin Sidebar Toggle (mobile) ──
function initAdminSidebar() {
  const toggle  = document.getElementById('sidebar-toggle');
  const sidebar = document.querySelector('.admin-sidebar');
  if (toggle && sidebar) {
    toggle.addEventListener('click', () => {
      sidebar.style.display = sidebar.style.display === 'none' ? 'flex' : 'none';
    });
  }
}

// ── Sell Form Submit ──
function initSellForm() {
  const form = document.getElementById('sell-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (validateForm('sell-form')) {
        showToast('🎉 Product listed successfully!');
        setTimeout(() => form.reset(), 1600);
      }
    });
  }
}

// ── Login / Signup Forms ──
function initAuthForms() {
  const loginForm  = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');

  // Login form is handled by handleLogin function via onsubmit attribute
  // No need for additional event listener here

  if (signupForm) {
    signupForm.addEventListener('submit', e => {
      e.preventDefault();
      if (validateForm('signup-form')) {
        showToast('Account created! Redirecting…');
        setTimeout(() => { window.location.href = '/'; }, 1500);
      }
    });
  }

  // Admin login
  const adminLoginForm = document.getElementById('admin-login-form');
  if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', e => {
      e.preventDefault();
      showToast('Admin portal accessing…');
      setTimeout(() => { window.location.href = '/dashboard'; }, 1500);
    });
  }
}

// ── Price Range Filter ──
function initPriceFilter() {
  const range = document.getElementById('price-range');
  const label = document.getElementById('price-label');
  if (range && label) {
    range.addEventListener('input', () => {
      label.textContent = `₹0 – ₹${range.value}`;
    });
  }
}

// ── Thumbnail switcher (Product Detail) ──
function initThumbs() {
  const thumbs  = document.querySelectorAll('.thumb');
  const mainImg = document.getElementById('main-img');
  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      thumbs.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
      if (mainImg) mainImg.src = thumb.querySelector('img').src;
    });
  });
}

// ── Init All ──
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initBulkDiscount();
  initImageUpload();
  initQtyControls();
  initSizeSelect();
  initPaymentOptions();
  initAddToCart();
  initCartActions();
  initCheckout();
  initAdminActions();
  initAdminSidebar();
  initSellForm();
  initAuthForms();
  highlightSelectedRole();
  prefillLoginForm();
  toggleSignupFields();
  toggleLoginFields();
  hydrateProfileFromStorage();
});

// Export functions for global access
window.handleLogin = handleLogin;
window.handleSignup = handleSignup;
window.handleUserLogin = handleUserLogin;
window.handleAdminLogin = handleAdminLogin;
window.checkLoginAndAddToCart = checkLoginAndAddToCart;
window.updateCartBadge = updateCartBadge;
window.checkLoginAndRedirect = checkLoginAndRedirect;
window.showRoleSelection = showRoleSelection;
window.closeRoleModal = closeRoleModal;
window.selectRoleAndRedirect = selectRoleAndRedirect;
window.scrollToSection = scrollToSection;
window.highlightSelectedRole = highlightSelectedRole;
window.highlightRoleOption = highlightRoleOption;
window.prefillLoginForm = prefillLoginForm;
window.toggleSignupFields = toggleSignupFields;
window.toggleLoginFields = toggleLoginFields;
window.toggleLoginType = toggleLoginType;
window.toggleEdit = toggleEdit;
window.saveProfile = saveProfile;
initPriceFilter();
initThumbs();
export {};
