// components/ToastNotification.js (Client Component)
'use client'; // Mark as client component

import Swal from 'sweetalert2';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  }
});

export const showSuccessToast = (message) => {
  Toast.fire({
    icon: 'success',
    title: message
  });
};

export const showErrorToast = (message) => {
  Toast.fire({
    icon: 'error',
    title: message
  });
};

// ... other toast types (warning, info)